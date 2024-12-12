import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { validateClearForm, validateEmailString } from "../../../lib/validation/generic";
import { getExtraData, setExtraData, deleteExtraData } from "../../../lib/utils/sessionUtils";
import { getFullUrl } from "../../../lib/utils/urlUtils";

interface AddPresenterViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    authPersonEmail: string | undefined;
}

export class AddPresenterHandler extends GenericHandler {
    viewData: AddPresenterViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.ADD_PRESENTER_PAGE,
            backLinkHref: "",
            lang: {},
            authPersonEmail: undefined,
            companyName: "",
            companyNumber: ""
        };
    }

    async execute (req: Request, method: string): Promise<AddPresenterViewData> {
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        this.viewData.lang = getTranslationsForView(req.lang, constants.ADD_PRESENTER_PAGE);
        this.viewData.backLinkHref = getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL).replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
        this.viewData.companyName = companyName;
        this.viewData.companyNumber = companyNumber;

        const clearForm = req.query.cf as string;
        if (validateClearForm(clearForm)) {
            deleteExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
            deleteExtraData(req.session, constants.PROPOSED_EMAIL);
        }

        if (method === constants.POST) {
            const email = req.body.email.trim();
            await this.validateEmail(email);
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
                await this.validateEmail(invalidProposedEmail);
                this.viewData.authPersonEmail = invalidProposedEmail;
            } else if (typeof validatedEmail === "string") {
                this.viewData.authPersonEmail = validatedEmail;
            }
        }

        return Promise.resolve(this.viewData);
    }

    private async validateEmail (email: string) {
        if (!email) {
            this.setError(constants.ERRORS_EMAIL_REQUIRED);
        } else if (!validateEmailString(email)) {
            this.setError(constants.ERRORS_EMAIL_INVALID);
        }
    }

    private setError (errProp: string) {
        this.viewData.errors = {
            email: {
                text: errProp
            }
        };
    }
}
