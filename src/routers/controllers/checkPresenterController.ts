import { Request, Response } from "express";
import { pages } from "../../constants";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";
import { addUserEmailAssociation } from "../../services/userCompanyAssociationService";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";

export interface AuthorisedPerson {
    companyName: string,
    userEmail: string,
    companyNumber: string
}

export const checkPresenterController = async (req: Request, res: Response) => {
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
    const emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);

    if (req.method === constants.POST) {
        if (emailAddress) {
            await addUserEmailAssociation(emailAddress, company.companyNumber);
            setExtraData(req.session, constants.AUTHORISED_PERSON, {
                authorisedPersonEmailAddress: emailAddress,
                authorisedPersonCompanyName: company.companyName
            });
        }
        // return res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
        //     `:${constants.COMPANY_NUMBER}`,
        //     company.companyNumber
        // ) + "?authPersonSuccess=true");
        return res.redirect(constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            company.companyNumber
        ));
    }

    const viewData = {
        lang: getTranslationsForView(req.t, pages.CHECK_PRESENTER),
        companyName: company.companyName,
        companyNumber: company.companyNumber,
        emailAddress,
        backLinkHref: getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.ADD_PRESENTER, company.companyNumber)
    };
    res.render(pages.CHECK_PRESENTER, viewData);
};
