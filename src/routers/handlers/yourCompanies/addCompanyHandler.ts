import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import logger, { createLogMessage } from "../../../lib/Logger";
import * as constants from "../../../constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { StatusCodes } from "http-status-codes";
import { setExtraData, getExtraData, deleteExtraData } from "../../../lib/utils/sessionUtils";
import { isOrWasCompanyAssociatedWithUser } from "../../../services/associationsService";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { ViewDataWithBackLink } from "../../../types/utilTypes";
import { validateClearForm } from "../../../lib/validation/generic";
import { AssociationState, AssociationStateResponse } from "../../../types/associations";
import { getFullUrl } from "../../../lib/utils/urlUtils";
import { HttpError } from "http-errors";

interface AddCompanyViewData extends ViewDataWithBackLink {
    proposedCompanyNumber: string | undefined;
}

/**
 * Handler for adding a company to a user's account.
 */
export class AddCompanyHandler extends GenericHandler {
    viewData: AddCompanyViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.ADD_COMPANY_PAGE,
            backLinkHref: constants.LANDING_URL,
            lang: {},
            proposedCompanyNumber: undefined
        };
    }

    /**
     * Executes the handler logic for GET and POST requests.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param method - The HTTP method (GET or POST).
     * @returns A promise resolving to the view data.
     */
    async execute (req: Request, res: Response, method: string): Promise<AddCompanyViewData> {
        const referrer: string | undefined = req.get("Referrer");
        const hrefB = getFullUrl(constants.ADD_COMPANY_URL);

        logger.info(createLogMessage(req.session, `${AddCompanyHandler.name}.${this.execute.name}`, `${method} request to add company to user account`));

        try {
            this.viewData.lang = getTranslationsForView(req.lang, constants.ADD_COMPANY_PAGE);

            const clearForm = req.query[constants.CLEAR_FORM] as string;
            if (validateClearForm(clearForm)) {
                deleteExtraData(req.session, constants.PROPOSED_COMPANY_NUM);
                deleteExtraData(req.session, constants.COMPANY_PROFILE);
            }

            if (method === constants.POST) {
                const { companyNumber } = req.body;
                setExtraData(req.session, constants.CURRENT_COMPANY_NUM, companyNumber);

                if (typeof companyNumber === "string") {
                    setExtraData(req.session, constants.PROPOSED_COMPANY_NUM, companyNumber);
                    deleteExtraData(req.session, constants.COMPANY_PROFILE);
                }

                this.viewData.proposedCompanyNumber = companyNumber;
                await this.validateCompanyNumber(req, companyNumber);
            } else {
                const invalidCompanyNumber = getExtraData(req.session, constants.PROPOSED_COMPANY_NUM);
                const savedProfile = getExtraData(req.session, constants.COMPANY_PROFILE);
                const currentCompanyNumber = getExtraData(req.session, constants.CURRENT_COMPANY_NUM);

                if (typeof invalidCompanyNumber === "string") {
                    this.viewData.proposedCompanyNumber = invalidCompanyNumber;
                    await this.validateCompanyNumber(req, invalidCompanyNumber);
                } else if (typeof savedProfile?.companyNumber === "string") {
                    this.viewData.proposedCompanyNumber = savedProfile.companyNumber;
                    await this.validateCompanyNumber(req, savedProfile.companyNumber);
                } else if (referrer && referrer.includes(hrefB) && currentCompanyNumber) {
                    this.viewData.proposedCompanyNumber = currentCompanyNumber;
                    await this.validateCompanyNumber(req, currentCompanyNumber);
                }
            }
        } catch (err: any) {
            if (err instanceof HttpError && [StatusCodes.NOT_FOUND, StatusCodes.BAD_REQUEST, StatusCodes.FORBIDDEN].includes(err.statusCode)) {
                this.viewData.errors = {
                    companyNumber: {
                        text: constants.ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG
                    }
                };
            } else {
                logger.error(createLogMessage(req.session, `${AddCompanyHandler.name}.${this.execute.name}`, `Error adding a company to user account: ${err}`));
                this.viewData.errors = this.processHandlerException(err);
            }
        }

        return Promise.resolve(this.viewData);
    }

    /**
     * Validates the provided company number.
     * @param req - The HTTP request object.
     * @param companyNumber - The company number to validate.
     */
    private async validateCompanyNumber (req: Request, companyNumber: string) {
        if (!companyNumber) {
            this.viewData.errors = {
                companyNumber: {
                    text: constants.ENTER_A_COMPANY_NUMBER
                }
            };
        } else {
            const companyProfile: CompanyProfile = await getCompanyProfile(companyNumber);
            if (companyProfile?.companyStatus?.toLocaleLowerCase() !== constants.COMPANY_STATUS_ACTIVE) {
                this.viewData.errors = {
                    companyNumber: {
                        text: constants.ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE
                    }
                };
            } else {
                await this.handleActiveCompany(req, companyProfile);
            }
        }
    }

    /**
     * Handles the case where the company is active.
     * @param req - The HTTP request object.
     * @param companyProfile - The company profile object.
     */
    private async handleActiveCompany (req: Request, companyProfile: CompanyProfile) {
        setExtraData(req.session, constants.COMPANY_NUMBER, companyProfile.companyNumber);
        deleteExtraData(req.session, constants.PROPOSED_COMPANY_NUM);

        const isAssociated: AssociationStateResponse = await isOrWasCompanyAssociatedWithUser(req, companyProfile.companyNumber);
        if (isAssociated.state === AssociationState.COMPANY_ASSOCIATED_WITH_USER) {
            this.viewData.errors = {
                companyNumber: {
                    text: constants.THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT
                }
            };
        } else {
            setExtraData(req.session, constants.COMPANY_PROFILE, companyProfile);
        }
    }
}
