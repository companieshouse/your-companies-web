import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { ViewData } from "../../../types/util-types";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getUrlWithCompanyNumber } from "../../../lib/utils/urlUtils";
import { createAssociation } from "../../../services/associationsService";
import { AuthorisedPerson } from "types/associations";

export class CheckPresenterHandler extends GenericHandler {

    async execute (req: Request, method: string): Promise<ViewData> {
        const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER]);
        const emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        this.viewData = await this.getViewData(req, company, emailAddress);
        if (method === constants.POST) {
            await createAssociation(req, company.companyNumber, emailAddress);
            const authorisedPerson: AuthorisedPerson = {
                authorisedPersonEmailAddress: emailAddress,
                authorisedPersonCompanyName: company.companyName
            };
            // save the details of the successfully authorised person
            setExtraData(req.session, constants.AUTHORISED_PERSON, authorisedPerson);
            // remove the to be authorised person email
            setExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL, undefined);
        }
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request, company: CompanyProfile, emailAddress: string): Promise<ViewData> {
        const translations = getTranslationsForView(req.t, constants.CHECK_PRESENTER_PAGE);
        const url = getUrlWithCompanyNumber(constants.YOUR_COMPANIES_ADD_PRESENTER_URL, company.companyNumber);

        return {
            lang: translations,
            companyName: company.companyName,
            companyNumber: company.companyNumber,
            emailAddress,
            backLinkHref: url,
            backLinkWithClearForm: url + constants.CLEAR_FORM_TRUE
        };
    }
}
