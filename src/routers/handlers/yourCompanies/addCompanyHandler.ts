import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import {
    COMPANY_PROFILE,
    COMPANY_STATUS_ACTIVE,
    LANDING_URL, POST,
    ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG,
    ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE,
    THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT,
    ADD_COMPANY_PAGE,
    COMPNANY_ASSOCIATED_WITH_USER,
    COMPANY_NUMBER,
    ENTER_A_COMPANY_NUMBER
} from "../../../constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { StatusCodes } from "http-status-codes";
import { getLoggedInUserEmail, setExtraData } from "../../../lib/utils/sessionUtils";
import { isCompanyAssociatedWithUser } from "../../../services/userCompanyAssociationService";
import { getTranslationsForView } from "../../../lib/utils/translations";

export class AddCompanyHandler extends GenericHandler {

    async execute (req: Request, res: Response, method: string): Promise<any> {
        logger.info(`${method} request to add company to user account`);
        // ...process request here and return data for the view
        try {
            this.viewData = this.getViewData();
            this.viewData.lang = getTranslationsForView(req.t, ADD_COMPANY_PAGE);
            if (method === POST) {
                const payload = Object.assign({}, req.body);
                if (!payload.companyNumber) {
                    this.viewData.errors = {
                        companyNumber: {
                            text: ENTER_A_COMPANY_NUMBER
                        }
                    };
                } else {
                    const companyProfile: CompanyProfile = await getCompanyProfile(payload.companyNumber);
                    if (companyProfile.companyStatus.toLocaleLowerCase() !== COMPANY_STATUS_ACTIVE) {
                        this.viewData.errors = {
                            companyNumber: {
                                text: ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE
                            }
                        };
                    } else {
                        setExtraData(req.session, COMPANY_PROFILE, companyProfile);
                        setExtraData(req.session, COMPANY_NUMBER, companyProfile.companyNumber);
                        const userEmailAddress = getLoggedInUserEmail(req.session);
                        const isAssociated: string = await isCompanyAssociatedWithUser(companyProfile.companyNumber, userEmailAddress);
                        if (isAssociated === COMPNANY_ASSOCIATED_WITH_USER) {
                            this.viewData.errors = {
                                companyNumber: {
                                    text: THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT
                                }
                            };
                        } else {
                            setExtraData(req.session, COMPANY_PROFILE, companyProfile);
                        }
                    }
                }
            }
        } catch (err: any) {
            if (err.httpStatusCode === StatusCodes.NOT_FOUND ||
                err.httpStatusCode === StatusCodes.BAD_REQUEST ||
                err.httpStatusCode === StatusCodes.FORBIDDEN) {
                this.viewData.errors = {
                    companyNumber: {
                        text: ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG
                    }
                };
            } else {
                logger.error(`Error adding a company to user account: ${err}`);
                this.viewData.errors = this.processHandlerException(err);
            }
        }
        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        return {
            backLinkHref: LANDING_URL
        };
    }
}
