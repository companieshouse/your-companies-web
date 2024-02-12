import { Request, Response, NextFunction } from "express";
import { pages } from "../../constants";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";
import { Session } from "@companieshouse/node-session-handler";

export const checkPresenterControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
    if (req.method === "POST") {
        return res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            company.companyNumber
        ));
    }
    const session: Session = req.session as Session;
    const emailAddress: string | undefined = session?.getExtraData("authorisedPersonEmail");

    const viewData = {
        lang: getTranslationsForView(req.t, pages.CHECK_PRESENTER),
        companyName: company.companyName,
        companyNumber: company.companyNumber,
        emailAddress,
        backLinkHref: getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.ADD_PRESENTER, company.companyNumber)
    };
    res.render(pages.CHECK_PRESENTER, viewData);
};

// export const checkPresenterControllerPost = async (req: Request, res: Response, next: NextFunction) => {

//     const viewData = { errors: "" };
//     const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
//     const companyNumber = company.companyNumber;
//     if (viewData.errors && Object.keys(viewData.errors).length > 0) {
//         res.redirect(getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.CHECK_PRESENTER, companyNumber));
//     } else {
//         res.redirect(getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.EMAIL_ADDED, companyNumber));
//     }
// };
