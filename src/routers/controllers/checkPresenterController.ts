import { Request, Response, NextFunction } from "express";
import { pages } from "../../constants";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";

export const checkPresenterControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);

    const viewData = {
        lang: getTranslationsForView(req.t, pages.CHECK_PRESENTER),
        companyName: company.companyName,
        companyNumber: company.companyNumber,
        emailAddress: "jill.edwards@example.com"
    };
    res.render(pages.CHECK_PRESENTER, viewData);
};

export const checkPresenterControllerPost = async (req: Request, res: Response, next: NextFunction) => {

    const viewData = { errors: "" };
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
    const companyNumber = company.companyNumber;
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.redirect(getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.CHECK_PRESENTER, companyNumber));
    } else {
        res.redirect(getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.EMAIL_ADDED, companyNumber));
    }
};
