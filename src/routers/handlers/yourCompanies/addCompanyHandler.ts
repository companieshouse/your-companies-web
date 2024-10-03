import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { StatusCodes } from "http-status-codes";
import { setExtraData, getExtraData, deleteExtraData } from "../../../lib/utils/sessionUtils";
import { isOrWasCompanyAssociatedWithUser } from "../../../services/associationsService";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { ViewData } from "../../../types/util-types";
import { validateClearForm } from "../../../lib/validation/generic";

import { AssociationState, AssociationStateResponse } from "../../../types/associations";

export class AddCompanyHandler extends GenericHandler {

    async execute (req: Request, res: Response, method: string): Promise<ViewData> {

        const referrer: string | undefined = req.get("Referrer");
        const hrefB = constants.YOUR_COMPANIES_ADD_COMPANY_URL;

        logger.info(`${method} request to add company to user account`);
        // ...process request here and return data for the view
        try {
            this.viewData = this.getViewData();
            this.viewData.lang = getTranslationsForView(req.lang, constants.ADD_COMPANY_PAGE);
            this.viewData.templateName = constants.ADD_COMPANY_PAGE;

            // we delete the form values when the journey begins again (cf param in url is true)
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
                // proposed company number is the value for the form input displayed in the view
                this.viewData.proposedCompanyNumber = companyNumber;
                await this.validateCompanyNumber(req, companyNumber);
            } else {
                // GET request validation
                const invalidCompanyNumber = getExtraData(req.session, constants.PROPOSED_COMPANY_NUM);
                const savedProfile = getExtraData(req.session, constants.COMPANY_PROFILE);
                const currentCompanyNumber = getExtraData(req.session, constants.CURRENT_COMPANY_NUM);
                // display any errors with the current input
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
            if (err.httpStatusCode === StatusCodes.NOT_FOUND ||
                err.httpStatusCode === StatusCodes.BAD_REQUEST ||
                err.httpStatusCode === StatusCodes.FORBIDDEN) {
                this.viewData.errors = {
                    companyNumber: {
                        text: constants.ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG
                    }
                };
            } else {
                logger.error(`Error adding a company to user account: ${err}`);
                this.viewData.errors = this.processHandlerException(err);
            }
        }
        return Promise.resolve(this.viewData);
    }

    private async validateCompanyNumber (req: Request, companyNumber: string) {

        if (!companyNumber) {
            this.viewData.errors = {
                companyNumber: {
                    text: constants.ENTER_A_COMPANY_NUMBER
                }
            };
        } else {
            const companyProfile: CompanyProfile = await getCompanyProfile(companyNumber);
            if (companyProfile.companyStatus.toLocaleLowerCase() !== constants.COMPANY_STATUS_ACTIVE) {
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

    private async handleActiveCompany (req: Request, companyProfile: CompanyProfile) {
        setExtraData(req.session, constants.COMPANY_NUMBER, companyProfile.companyNumber);
        deleteExtraData(req.session, constants.PROPOSED_COMPANY_NUM);

        const isAssociated: AssociationStateResponse = await isOrWasCompanyAssociatedWithUser(req, companyProfile.companyNumber);
        if (isAssociated.state === AssociationState.COMPNANY_ASSOCIATED_WITH_USER) {
            this.viewData.errors = {
                companyNumber: {
                    text: constants.THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT
                }
            };
        } else {
            setExtraData(req.session, constants.COMPANY_PROFILE, companyProfile);
        }
    }

    private getViewData (): ViewData {
        return {
            backLinkHref: constants.LANDING_URL
        } as ViewData;
    }
}
