import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { ViewDataWithBackLink } from "../../../types/utilTypes";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";

/**
 * View data for the confirmation person added page.
 */
interface ConfirmationPersonAddedViewData extends ViewDataWithBackLink {
    companyName: string;
    companyNumber: string;
    userEmail: string;
    managePeopleHref: string;
}

/**
 * Handler for the confirmation person added page.
 * Prepares view data for rendering the confirmation page after a person is added.
 */
export class ConfirmationPersonAddedHandler extends GenericHandler {
    /**
     * Stores the view data for the confirmation page.
     */
    viewData: ConfirmationPersonAddedViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.CONFIRMATION_PERSON_ADDED_PAGE,
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
    async execute (req: Request): Promise<ConfirmationPersonAddedViewData> {
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        const { authorisedPersonEmailAddress, authorisedPersonCompanyName } = getExtraData(req.session, constants.AUTHORISED_PERSON);

        this.viewData = {
            ...this.viewData,
            lang: getTranslationsForView(req.lang, constants.CONFIRMATION_PERSON_ADDED_PAGE),
            companyName: authorisedPersonCompanyName,
            companyNumber,
            userEmail: authorisedPersonEmailAddress,
            managePeopleHref: getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber)
        };

        return this.viewData;
    }
}
