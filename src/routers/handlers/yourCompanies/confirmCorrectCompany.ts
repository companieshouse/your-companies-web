import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getTranslationsForView } from "../../../lib/utils/translations";
// import { createRandomCompanyProfile } from "../../lib/mockData/generateMockCompanyProfile";
import * as constants from "../../../constants";

export class ConfirmCorrectCompany extends GenericHandler {
    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve the confirm correct company page`);
        this.viewData = this.getViewData(req, response);
        this.viewData.lang = getTranslationsForView(
            req.t,
            constants.CONFIRM_COMPANY_LANG
        );
        return Promise.resolve(this.viewData);
    }

    post (req: Request, response: Response): Promise<Object> {
        const companyProfile: CompanyProfile | undefined =
        req.session?.getExtraData(constants.COMPANY_PROFILE);
        if (companyProfile !== undefined) {
            return Promise.resolve(companyProfile.companyNumber);
        }
        return Promise.resolve(false);
    }

    private getViewData (req: Request, response: Response): any {
        logger.info(`getting profile from session`);

        let companyDetails: Partial<CompanyProfile> | undefined =
      req.session?.getExtraData(constants.COMPANY_PROFILE);
        logger.info(`the company details are ${companyDetails}`);

        let registeredOfficeAddress:string = "";

        if (companyDetails) {
            console.table(companyDetails);
            registeredOfficeAddress = `${companyDetails?.registeredOfficeAddress?.addressLineOne}<br>
            ${companyDetails?.registeredOfficeAddress?.addressLineTwo}<br>
            ${companyDetails?.registeredOfficeAddress?.locality}<br>   
            ${companyDetails?.registeredOfficeAddress?.postalCode}`;
        } else {
            logger.info("no company details object");
            companyDetails = {};
        }
        logger.info(`about the return company details for display`);

        return {
            ...companyDetails,
            backLinkUrl: "/your-companies/add-a-company",
            registeredOfficeAddress
        };
    }
}
