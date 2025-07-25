import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { ViewDataWithBackLink } from "../../../types/utilTypes";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";

/**
 * View data for the confirmation authorisation email resent page.
 */
interface ConfirmationAuthorisationEmailResentViewData extends ViewDataWithBackLink {
    companyName: string;
    companyNumber: string;
    userEmail: string;
    managePeopleHref: string;
}

/**
 * Handler for the confirmation authorisation email resent page.
 * Prepares view data for rendering the confirmation page after an authorisation email to a person is resent.
 */
export class ConfirmationAuthorisationEmailResentHandler extends GenericHandler {
    /**
     * Stores the view data for the confirmation page.
     */
    viewData: ConfirmationAuthorisationEmailResentViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_PAGE,
            backLinkHref: constants.LANDING_URL,
            lang: {},
            companyName: "",
            companyNumber: "",
            userEmail: "",
            managePeopleHref: ""
        };
    }

    /**
     * Executes the handler logic to prepare view data for the confirmation page.
     * @param req Express request object
     * @returns Promise resolving to populated view data
     */
    async execute (req: Request): Promise<ConfirmationAuthorisationEmailResentViewData> {
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const userEmail = getExtraData(req.session, constants.RESENT_SUCCESS_EMAIL);

        this.viewData = {
            ...this.viewData,
            lang: getTranslationsForView(req.lang, constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_PAGE),
            companyName,
            companyNumber,
            userEmail,
            managePeopleHref: getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber)
        };

        return this.viewData;
    }
}
