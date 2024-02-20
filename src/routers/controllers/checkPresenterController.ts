import { Request, Response } from "express";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";
import { addUserEmailAssociation } from "../../services/userCompanyAssociationService";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const checkPresenterController = async (req: Request, res: Response) => {
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
    const emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);

    if (req.method === constants.POST) {
        if (emailAddress) {
            await addUserEmailAssociation(emailAddress, company.companyNumber);
        }
        return res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            company.companyNumber
        ));
    }

    const viewData = {
        lang: getTranslationsForView(req.t, constants.CHECK_PRESENTER_PAGE),
        companyName: company.companyName,
        companyNumber: company.companyNumber,
        emailAddress,
        backLinkHref: getUrlWithCompanyNumber(constants.YOUR_COMPANIES_ADD_PRESENTER_URL, company.companyNumber)
    };
    res.render(constants.CHECK_PRESENTER_PAGE, viewData);
};
