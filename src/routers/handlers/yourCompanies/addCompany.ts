import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import { COMPANY_STATUS_ACTIVE, LANDING_URL, POST, YOU_MUST_ENTER_A_COMPANY_NUMBER } from "../../../constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../../services/companyProfileService";

export class AddCompanyHandler extends GenericHandler {

    async execute (req: Request, res: Response, method: string): Promise<any> {
        logger.info(`${method} request to add company to user account`);
        // ...process request here and return data for the view
        try {
            this.viewData = this.getViewData();
            if (method === POST) {
                const payload = Object.assign({}, req.body);
                const companyProfile: CompanyProfile = await getCompanyProfile(payload.companyNumber);
                if (companyProfile.companyStatus.toLocaleLowerCase() !== COMPANY_STATUS_ACTIVE) {
                    this.viewData.error = YOU_MUST_ENTER_A_COMPANY_NUMBER;
                }
            }
        } catch (err: any) {
            logger.error(`Error adding a company to user account: ${err}`);
            this.viewData.errors = this.processHandlerException(err);
        }

        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        return {
            backLinkHref: LANDING_URL
        };
    }
};
