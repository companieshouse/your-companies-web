import { Request, Response } from "express";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";
import { addUserEmailAssociation } from "../../services/userCompanyAssociationService";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { AuthorisedPerson } from "../../types/associations";

export const checkPresenterController = async (req: Request, res: Response): Promise<void> => {
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER]);
    const emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);

    if (req.method === constants.POST) {
        if (emailAddress) {
            await addUserEmailAssociation(emailAddress, company.companyNumber);
            const authorisedPerson: AuthorisedPerson = {
                authorisedPersonEmailAddress: emailAddress,
                authorisedPersonCompanyName: company.companyName
            };
            // save the details of the successfully authorised person
            setExtraData(req.session, constants.AUTHORISED_PERSON, authorisedPerson);
            // remove the to be authorised person email
            setExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL, undefined);
        }
        return res.redirect(constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(
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
