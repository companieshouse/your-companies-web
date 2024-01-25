import { Request, Response } from "express";
import { GenericHandler } from "./generic";
import logger from "../../lib/Logger";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getTranslationsForView } from "../../lib/utils/translations";
import { createRandomCompanyProfile } from "../../lib/mockData/generateMockCompanyProfile";
import * as constants from "../../constants";

export class ConfirmCorrectCompany extends GenericHandler {

    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve the confirm correct company page`);
        this.viewData = this.getViewData();
        this.viewData.lang = getTranslationsForView(req.t, constants.CONFIRM_COMPANY_LANG);
        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        // we anticipate the retrieved company details to be stored in the session
        // const companyDetails: CompanyProfile | undefined = req.session?.getExtraData(COMPANY_DETAILS);

        const companyDetails:Partial<CompanyProfile> = createRandomCompanyProfile();
        const registeredOfficeAddress = `${companyDetails.registeredOfficeAddress?.addressLineOne}<br>
                ${companyDetails.registeredOfficeAddress?.addressLineTwo}<br>
                ${companyDetails.registeredOfficeAddress?.locality}<br>   
                ${companyDetails.registeredOfficeAddress?.postalCode}`;

        return {
            ...companyDetails,
            backLinkUrl: "/your-companies/add-a-company",
            registeredOfficeAddress
        };
    }
};
