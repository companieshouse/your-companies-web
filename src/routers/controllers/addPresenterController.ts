import { Request, Response, NextFunction } from "express";
import { pages } from "../../constants";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";

export const addPresenterControllerGet = async (req: Request, res: Response, next: NextFunction) => {

    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);

    const viewData = {
        lang: getTranslationsForView(req.t, pages.ADD_PRESENTER),
        companyName: company.companyName,
        companyNumber: company.companyNumber
    };
    res.render(pages.ADD_PRESENTER, viewData);
};

export const addPresenterControllerPost = async (req: Request, res: Response, next: NextFunction) => {

    const viewData = { errors: false };
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
    const companyNumber = company.companyNumber;
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.redirect(getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.ADD_PRESENTER, companyNumber));
    } else {
        res.redirect(getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.CHECK_PRESENTER, companyNumber));
    }
};
