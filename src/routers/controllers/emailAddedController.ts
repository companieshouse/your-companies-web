import { Request, Response, NextFunction } from "express";
import { pages } from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import * as constants from "../../constants";

export const emailAddedControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
    const { companyNumber, companyName } = company;
    res.render(pages.EMAIL_ADDED, {
        companyName, companyNumber
    });
};
