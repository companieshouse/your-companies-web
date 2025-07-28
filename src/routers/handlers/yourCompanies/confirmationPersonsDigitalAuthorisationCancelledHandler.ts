import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { ViewDataWithBackLink } from "../../../types/utilTypes";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";

/**
 * View data for the confirmation person's digital authorisation cancelled page.
 */
interface ConfirmationPersonsDigitalAuthorisationCancelledViewData extends ViewDataWithBackLink {
    companyName: string;
    companyNumber: string;
    userEmail: string;
    managePeopleHref: string;
}

/**
 * Handler for the confirmation person's digital authorisation cancelled page.
 * Prepares view data for rendering the confirmation page after person's digital authorisation is cancelled.
 */
export class ConfirmationPersonsDigitalAuthorisationCancelledHandler extends GenericHandler {
    /**
     * Stores the view data for the confirmation page.
     */
    viewData: ConfirmationPersonsDigitalAuthorisationCancelledViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_PAGE,
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
    async execute (req: Request): Promise<ConfirmationPersonsDigitalAuthorisationCancelledViewData> {
        const { companyNumber, companyName, userNameOrEmail } = getExtraData(req.session, constants.PERSON_REMOVED_CONFIRMATION_DATA);

        this.viewData = {
            ...this.viewData,
            lang: getTranslationsForView(req.lang, constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_PAGE),
            companyName,
            companyNumber,
            userEmail: userNameOrEmail,
            managePeopleHref: getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber)
        };

        return this.viewData;
    }
}
