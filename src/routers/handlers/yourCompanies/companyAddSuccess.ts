import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getTranslationsForView } from "../../../lib/utils/translations";
// import { createRandomCompanyProfile } from "../../lib/mockData/generateMockCompanyProfile";
import * as constants from "../../../constants";

export class CompanyAddSuccess extends GenericHandler {
    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve company add success page`);
        this.viewData = this.getViewData(req, response);
        this.viewData.lang = getTranslationsForView(
            req.t,
            constants.COMPANY_ADD_SUCCESS
        );
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request, response: Response): any {
        logger.info(`getting COMPANY NAME from session`);
        let companyDetails: Partial<CompanyProfile> | undefined =
      req.session?.getExtraData(constants.COMPANY_PROFILE);
        logger.info(`the company details are ${companyDetails}`);
        if (companyDetails) {
            console.table(companyDetails);
        } else {
            logger.info("no company details object, default to unknown");
            companyDetails = { companyName: "unknown" };
        }
        logger.info(`about the return company name for success display`);

        return {
            companyName: companyDetails.companyName,
            backLinkUrl: constants.YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL
        };
    }
}
