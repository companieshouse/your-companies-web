import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getCompanyProfile } from "../../../services/companyProfileService";

export class CompanyAddSuccessHandler extends GenericHandler {
    async execute (req: Request, response: Response): Promise<Object> {
        this.viewData = await this.getViewData(req, response);
        this.viewData.lang = getTranslationsForView(
            req.t,
            constants.COMPANY_ADD_SUCCESS
        );
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request, response: Response): Promise<Object> {
        const company: CompanyProfile = await getCompanyProfile(req.params.companyNumber as string);

        return Promise.resolve({
            companyName: company.companyName,
            feedbackSource: constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL
        });
    }
}
