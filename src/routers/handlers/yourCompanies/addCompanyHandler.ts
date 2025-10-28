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
import { validateClearForm, validateFullCompanyNumberSearchString } from "../../../lib/validation/generic";
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
        const referrer = req.get("Referrer");
        const hrefB = getFullUrl(constants.ADD_COMPANY_URL);
        logger.info(createLogMessage(req, `${AddCompanyHandler.name}.${this.execute.name}`, `${method} request to add company to user account`));

        try {
            this.viewData.lang = getTranslationsForView(req.lang, constants.ADD_COMPANY_PAGE);
            this.clearFormIfRequested(req);

            if (method === constants.POST) {
                await this.handlePost(req);
            } else {
                await this.handleGet(req, referrer, hrefB);
            }
        } catch (err: any) {
            this.handleError(req, err);
        }

        return Promise.resolve(this.viewData);
    }

    /**
 * Clears session data if the clear form flag is set in the request query.
 * @param req - The HTTP request object.
 */
    private clearFormIfRequested (req: Request): void {
        const clearForm = req.query[constants.CLEAR_FORM] as string;
        if (validateClearForm(clearForm)) {
            deleteExtraData(req.session, constants.PROPOSED_COMPANY_NUM);
            deleteExtraData(req.session, constants.COMPANY_PROFILE);
        }
    }

    /**
 * Handles logic specific to POST requests, including setting and validating the company number.
 * @param req - The HTTP request object.
 */
    private async handlePost (req: Request): Promise<void> {
        const { companyNumber } = req.body;
        setExtraData(req.session, constants.CURRENT_COMPANY_NUM, companyNumber);

        if (typeof companyNumber === "string") {
            setExtraData(req.session, constants.PROPOSED_COMPANY_NUM, companyNumber);
            deleteExtraData(req.session, constants.COMPANY_PROFILE);
        }

        this.viewData.proposedCompanyNumber = companyNumber;
        await this.validateCompanyNumber(req, companyNumber);
    }

    /**
 * Handles logic specific to GET requests, including restoring and validating a previously entered company number.
 * @param req - The HTTP request object.
 * @param referrer - The HTTP referrer header value.
 * @param hrefB - The full URL of the add company page.
 */
    private async handleGet (req: Request, referrer?: string, hrefB?: string): Promise<void> {
        const invalidCompanyNumber = getExtraData(req.session, constants.PROPOSED_COMPANY_NUM);
        const savedProfile = getExtraData(req.session, constants.COMPANY_PROFILE);
        const currentCompanyNumber = getExtraData(req.session, constants.CURRENT_COMPANY_NUM);

        if (typeof invalidCompanyNumber === "string") {
            await this.setAndValidateCompanyNumber(req, invalidCompanyNumber);
        } else if (typeof savedProfile?.companyNumber === "string") {
            await this.setAndValidateCompanyNumber(req, savedProfile.companyNumber);
        } else if (referrer?.includes(hrefB!) && currentCompanyNumber) {
            await this.setAndValidateCompanyNumber(req, currentCompanyNumber);
        }
    }

    /**
 * Sets the proposed company number in the view data and validates it.
 * @param req - The HTTP request object.
 * @param companyNumber - The company number to validate.
 */
    private async setAndValidateCompanyNumber (req: Request, companyNumber: string): Promise<void> {
        this.viewData.proposedCompanyNumber = companyNumber;
        await this.validateCompanyNumber(req, companyNumber);
    }

    /**
 * Handles errors thrown during execution, including setting appropriate error messages in the view data.
 * @param req - The HTTP request object.
 * @param err - The error object caught during execution.
 */
    private handleError (req: Request, err: any): void {
        const companyNumber = getExtraData(req.session, constants.CURRENT_COMPANY_NUM);

        if (err instanceof HttpError &&
            [StatusCodes.NOT_FOUND, StatusCodes.BAD_REQUEST, StatusCodes.FORBIDDEN].includes(err.statusCode)) {
            this.viewData.errors = {
                companyNumber: {
                    text: companyNumber.length === 8
                        ? constants.ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE
                        : constants.ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG
                }
            };
        } else {
            logger.error(createLogMessage(req, `${AddCompanyHandler.name}.${this.execute.name}`, `Error adding a company to user account: ${err}`));
            this.viewData.errors = this.processHandlerException(err);
        }
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
        } else if (!validateFullCompanyNumberSearchString(companyNumber)) {
            logger.info(createLogMessage(req, `${AddCompanyHandler.name}`, `Company number regex validation failed for ${companyNumber}`));

            this.viewData.errors = {
                companyNumber: {
                    text: constants.ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE
                }
            };
        } else {
            const companyProfile: CompanyProfile = await getCompanyProfile(companyNumber, req.requestId);
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
