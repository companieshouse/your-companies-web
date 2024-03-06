import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { StatusCodes } from "http-status-codes";
import { getLoggedInUserEmail, setExtraData } from "../../../lib/utils/sessionUtils";
import { isCompanyAssociatedWithUser } from "../../../services/userCompanyAssociationService";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { ViewData } from "../../../types/util-types";

export class AddCompanyHandler extends GenericHandler {

    async execute (req: Request, res: Response, method: string): Promise<ViewData> {
        logger.info(`${method} request to add company to user account`);
        // ...process request here and return data for the view
        try {
            this.viewData = this.getViewData();
            this.viewData.lang = getTranslationsForView(req.t, constants.ADD_COMPANY_PAGE);
            if (method === constants.POST) {
                await this.handlePost(req);
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

    private async handlePost (req: Request) {
        const payload = Object.assign({}, req.body);
        if (!payload.companyNumber) {
            this.viewData.errors = {
                companyNumber: {
                    text: constants.ENTER_A_COMPANY_NUMBER
                }
            };
        } else {
            const companyProfile: CompanyProfile = await getCompanyProfile(payload.companyNumber);
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
        setExtraData(req.session, constants.COMPANY_PROFILE, companyProfile);
        setExtraData(req.session, constants.COMPANY_NUMBER, companyProfile.companyNumber);
        const userEmailAddress = getLoggedInUserEmail(req.session);
        const isAssociated: string = await isCompanyAssociatedWithUser(companyProfile.companyNumber, userEmailAddress);
        if (isAssociated === constants.COMPNANY_ASSOCIATED_WITH_USER) {
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
