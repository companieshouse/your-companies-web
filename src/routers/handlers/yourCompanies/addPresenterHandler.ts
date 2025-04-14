import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { validateClearForm, validateEmailString } from "../../../lib/validation/generic";
import { getExtraData, setExtraData, deleteExtraData } from "../../../lib/utils/sessionUtils";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";

interface AddPresenterViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    authPersonEmail: string | undefined;
}

/**
 * Handles the logic for the "Add Presenter" page.
 * Manages the retrieval, validation, and persistence of presenter email data.
 */
export class AddPresenterHandler extends GenericHandler {
    viewData: AddPresenterViewData;

    /**
     * Initializes the handler with default view data.
     */
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

    /**
     * Executes the handler logic based on the HTTP method.
     * Retrieves and validates email data, manages session data, and prepares view data.
     *
     * @param req - The HTTP request object.
     * @param method - The HTTP method (GET or POST).
     * @returns The prepared view data for rendering.
     */
    async execute (req: Request, method: string): Promise<AddPresenterViewData> {
        this.initializeViewData(req);

        if (this.shouldClearForm(req)) {
            this.clearFormData(req);
        }

        if (method === constants.POST) {
            await this.handlePostRequest(req);
        } else {
            this.handleGetRequest(req);
        }

        return Promise.resolve(this.viewData);
    }

    /**
     * Initializes the view data with company information and translations.
     *
     * @param req - The HTTP request object.
     */
    private initializeViewData (req: Request): void {
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);

        this.viewData.lang = getTranslationsForView(req.lang, constants.ADD_PRESENTER_PAGE);
        this.viewData.backLinkHref = getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
        this.viewData.companyName = companyName;
        this.viewData.companyNumber = companyNumber;
    }

    /**
     * Determines if the form should be cleared based on the request query.
     *
     * @param req - The HTTP request object.
     * @returns True if the form should be cleared, false otherwise.
     */
    private shouldClearForm (req: Request): boolean {
        const clearForm = req.query.cf as string;
        return validateClearForm(clearForm);
    }

    /**
     * Clears form-related data from the session.
     *
     * @param req - The HTTP request object.
     */
    private clearFormData (req: Request): void {
        deleteExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        deleteExtraData(req.session, constants.PROPOSED_EMAIL);
    }

    /**
     * Handles the logic for POST requests.
     * Validates the email input and updates session and view data accordingly.
     *
     * @param req - The HTTP request object.
     */
    private async handlePostRequest (req: Request): Promise<void> {
        const email = req.body.email.trim();
        await this.validateEmail(email);

        if (!this.viewData.errors) {
            setExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL, email);
            deleteExtraData(req.session, constants.PROPOSED_EMAIL);
        } else {
            this.viewData.authPersonEmail = email;
            setExtraData(req.session, constants.PROPOSED_EMAIL, email);
            deleteExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        }
    }

    /**
     * Handles the logic for GET requests.
     * Retrieves and validates email data from the session and updates view data.
     *
     * @param req - The HTTP request object.
     */
    private handleGetRequest (req: Request): void {
        const invalidProposedEmail = getExtraData(req.session, constants.PROPOSED_EMAIL);
        const validatedEmail = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);

        if (typeof invalidProposedEmail === "string") {
            this.validateEmail(invalidProposedEmail);
            this.viewData.authPersonEmail = invalidProposedEmail;
        } else if (typeof validatedEmail === "string") {
            this.viewData.authPersonEmail = validatedEmail;
        }
    }

    /**
     * Validates the provided email address.
     * Sets an error in the view data if the email is invalid.
     *
     * @param email - The email address to validate.
     */
    private async validateEmail (email: string): Promise<void> {
        if (!email) {
            this.setError(constants.ERRORS_EMAIL_REQUIRED);
        } else if (!validateEmailString(email)) {
            this.setError(constants.ERRORS_EMAIL_INVALID);
        }
    }

    /**
     * Sets an error message in the view data.
     *
     * @param errProp - The error message to set.
     */
    private setError (errProp: string): void {
        this.viewData.errors = {
            email: {
                text: errProp
            }
        };
    }
}
