import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { BaseViewData } from "../../../types/utilTypes";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";

/**
 * View data for the confirmation person removed page.
 */
interface ConfirmationPersonRemovedViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    userNameOrEmail: string;
    managePeopleHref: string;
    changeAuthenticationCodeHref: string;
}

/**
 * Handler for the confirmation person removed page.
 * Prepares view data for rendering the confirmation page after a person is removed.
 */
export class ConfirmationPersonRemovedHandler extends GenericHandler {
    /**
     * Stores the view data for the confirmation page.
     */
    viewData: ConfirmationPersonRemovedViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.CONFIRMATION_PERSON_REMOVED_PAGE,
            lang: {},
            companyName: "",
            companyNumber: "",
            userNameOrEmail: "",
            managePeopleHref: "",
            changeAuthenticationCodeHref: ""
        };
    }

    /**
     * Executes the handler logic to prepare view data for the confirmation page.
     * @param req Express request object
     * @returns Promise resolving to populated view data
     */
    async execute (req: Request): Promise<ConfirmationPersonRemovedViewData> {
        const { userNameOrEmail, companyNumber, companyName } = getExtraData(
            req.session,
            constants.PERSON_REMOVED_CONFIRMATION_DATA
        );

        this.viewData = {
            ...this.viewData,
            lang: getTranslationsForView(req.lang, constants.CONFIRMATION_PERSON_REMOVED_PAGE),
            companyName,
            companyNumber,
            userNameOrEmail,
            managePeopleHref: getManageAuthorisedPeopleFullUrl(companyNumber),
            changeAuthenticationCodeHref: req.lang === "cy"
                ? constants.CHANGE_COMPANY_AUTH_CODE_URL_WELSH
                : constants.CHANGE_COMPANY_AUTH_CODE_URL_ENGLISH
        };

        return this.viewData;
    }
}
