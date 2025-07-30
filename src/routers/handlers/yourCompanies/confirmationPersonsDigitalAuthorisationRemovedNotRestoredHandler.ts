import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { ViewDataWithBackLink } from "../../../types/utilTypes";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";

/**
 * View data for the confirmation person's digital authorisation removed not restored page.
 */
interface ConfirmationPersonsDigitalAuthorisationRemovedNoRestoredViewData extends ViewDataWithBackLink {
    companyName: string;
    companyNumber: string;
    userNameOrEmail: string;
    managePeopleHref: string;
}

/**
 * Handler for the confirmation person's digital authorisation removed not restored page.
 * Prepares view data for rendering the confirmation page after a person's digital authorisation is removed not restored.
 */
export class ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler extends GenericHandler {
    /**
     * Stores the view data for the confirmation page.
     */
    viewData: ConfirmationPersonsDigitalAuthorisationRemovedNoRestoredViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_PAGE,
            backLinkHref: constants.LANDING_URL,
            lang: {},
            companyName: "",
            companyNumber: "",
            userNameOrEmail: "",
            managePeopleHref: ""
        };
    }

    /**
     * Executes the handler logic to prepare view data for the confirmation page.
     * @param req Express request object
     * @returns Promise resolving to populated view data
     */
    async execute (req: Request): Promise<ConfirmationPersonsDigitalAuthorisationRemovedNoRestoredViewData> {
        const { userNameOrEmail, companyNumber, companyName } = getExtraData(
            req.session,
            constants.PERSON_REMOVED_CONFIRMATION_DATA
        );

        this.viewData = {
            ...this.viewData,
            lang: getTranslationsForView(req.lang, constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_PAGE),
            companyName,
            companyNumber,
            userNameOrEmail,
            managePeopleHref: getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber)
        };

        return this.viewData;
    }
}
