import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { ViewData } from "../../../types/util-types";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import * as constants from "../../../constants";
import { validateEmailString } from "../../../lib/validation/generic";
import { isEmailAuthorised, isEmailInvited } from "../../../services/userCompanyAssociationService";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";

export class AddPresenterHandler extends GenericHandler {

    async execute (req: Request, method: string): Promise<ViewData> {
        const company: CompanyProfile = await getCompanyProfile(
            req.params[constants.COMPANY_NUMBER]
        );
        const { companyName, companyNumber } = company;
        this.viewData = await this.getViewData(req, company);
        this.viewData.authPersonEmail = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        if (method === constants.POST) {
            const email = req.body.email.trim();
            await this.validateEmail(email, companyNumber, companyName);
            if (!this.viewData.errors) {
                setExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL + companyNumber, email);
            } else {
                this.viewData.authPersonEmail = email;
            }
        }
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request, company: CompanyProfile): Promise<ViewData> {
        const { companyName, companyNumber } = company;
        const translations = getTranslationsForView(req.t, constants.ADD_PRESENTER_PAGE);
        const href = constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);

        return {
            lang: translations,
            companyName,
            companyNumber,
            backLinkHref: href
        };
    }

    private async validateEmail (email: string, companyNumber: string, companyName: string) {
        if (!email) {
            this.setError(constants.ERRORS_EMAIL_REQUIRED);
        } else if (!validateEmailString(email)) {
            this.setError(constants.ERRORS_EMAIL_INVALID);
        } else if (await isEmailAuthorised(email, companyNumber)) {
            this.viewData.lang[constants.ERRORS_EMAIL_ALREADY_AUTHORISED] += companyName;
            this.setError(constants.ERRORS_EMAIL_ALREADY_AUTHORISED);
        } else if (await isEmailInvited(email, companyNumber)) {
            this.viewData.lang[constants.ERRORS_PERSON_ALREADY_INVITED] += companyName;
            this.setError(constants.ERRORS_PERSON_ALREADY_INVITED);
        }
    }

    private setError = (errProp: string) => {
        this.viewData.errors = {
            email: {
                text: errProp
            }
        };
    };
}
