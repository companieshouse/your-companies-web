import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { ViewDataWithBackLink } from "../../../types/utilTypes";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";

/**
 * View data for the confirmation person's digital authorisation restored page.
 */
interface ConfirmationPersonsDigitalAuthorisationRestoredViewData extends ViewDataWithBackLink {
    companyName: string;
    companyNumber: string;
    userEmail: string;
    managePeopleHref: string;
}

/**
 * Handler for the confirmation person's digital authorisation restored page.
 * Prepares view data for rendering the confirmation page after person's digital authorisation is restored.
 */
export class ConfirmationPersonsDigitalAuthorisationRestoredHandler extends GenericHandler {
    /**
     * Stores the view data for the confirmation page.
     */
    viewData: ConfirmationPersonsDigitalAuthorisationRestoredViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_PAGE,
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
    async execute (req: Request): Promise<ConfirmationPersonsDigitalAuthorisationRestoredViewData> {
        const { authorisedPersonCompanyName, authorisedPersonEmailAddress } = getExtraData(req.session, constants.AUTHORISED_PERSON);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);

        this.viewData = {
            ...this.viewData,
            lang: getTranslationsForView(req.lang, constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_PAGE),
            companyName: authorisedPersonCompanyName,
            companyNumber,
            userEmail: authorisedPersonEmailAddress,
            managePeopleHref: getManageAuthorisedPeopleFullUrl(companyNumber)
        };

        return this.viewData;
    }
}
