import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { ViewData } from "../../../types/util-types";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { validateClearForm, validateEmailString } from "../../../lib/validation/generic";
import { isEmailAuthorised, isEmailInvited } from "../../../services/associationsService";
import { getExtraData, setExtraData, deleteExtraData } from "../../../lib/utils/sessionUtils";

export class AddPresenterHandler extends GenericHandler {

    async execute (req: Request, method: string): Promise<ViewData> {
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        this.viewData = await this.getViewData(req, companyNumber, companyName);
        const clearForm = req.query.cf as string;
        if (validateClearForm(clearForm)) {
            deleteExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
            deleteExtraData(req.session, constants.PROPOSED_EMAIL);
        }

        if (method === constants.POST) {
            const email = req.body.email.trim();
            await this.validateEmail(req, email, companyNumber, companyName);
            if (!this.viewData.errors) {
                setExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL, email);
                deleteExtraData(req.session, constants.PROPOSED_EMAIL);
            } else {
                // update the dispay input
                this.viewData.authPersonEmail = email;
                // save the proposed invalid company email
                setExtraData(req.session, constants.PROPOSED_EMAIL, email);
                deleteExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
            }
            // the method is GET
        } else {
            // retrieve the saved email inputs
            const invalidProposedEmail = getExtraData(req.session, constants.PROPOSED_EMAIL);
            const validatedEmail = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
            // display any errors with the current input
            if (typeof invalidProposedEmail === "string") {
                await this.validateEmail(req, invalidProposedEmail, companyNumber, companyName);
                this.viewData.authPersonEmail = invalidProposedEmail;
            } else if (typeof validatedEmail === "string") {
                this.viewData.authPersonEmail = validatedEmail;
            }
        }

        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request, companyNumber: string, companyName: string): Promise<ViewData> {
        const translations = getTranslationsForView(req.t, constants.ADD_PRESENTER_PAGE);
        const href = constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);

        return {
            lang: translations,
            companyName,
            companyNumber,
            backLinkHref: href
        };
    }

    private async validateEmail (req: Request, email: string, companyNumber: string, companyName: string) {
        if (!email) {
            this.setError(constants.ERRORS_EMAIL_REQUIRED);
        } else if (!validateEmailString(email)) {
            this.setError(constants.ERRORS_EMAIL_INVALID);
        } else if (await isEmailAuthorised(req, email, companyNumber)) {
            this.viewData.lang[constants.ERRORS_EMAIL_ALREADY_AUTHORISED] += companyName;
            this.setError(constants.ERRORS_EMAIL_ALREADY_AUTHORISED);
        } else if (await isEmailInvited(req, email, companyNumber)) {
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
