import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { BaseViewData, CompanyNameAndNumber } from "../../../types/utilTypes";
import { getExtraData } from "../../../lib/utils/sessionUtils";

/**
 * Interface representing the view data for the ConfirmationYourDigitalAuthorisationRestoredHandler.
 */
interface ConfirmationYourDigitalAuthorisationRestoredViewData extends BaseViewData, CompanyNameAndNumber {
    buttonHref: string;
}

/**
 * Handler for rendering the confirmation page when a user's digital authorisation is restored.
 * Prepares the view data including translations, company details, and button link.
 */
export class ConfirmationYourDigitalAuthorisationRestoredHandler extends GenericHandler {
    viewData: ConfirmationYourDigitalAuthorisationRestoredViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE,
            lang: {},
            companyName: "",
            companyNumber: "",
            buttonHref: constants.LANDING_URL
        };
    }

    /**
     * Executes the handler logic to populate view data for the confirmation page.
     * @param req - Express request object containing session and language info.
     * @returns Populated view data for the confirmation page.
     */
    async execute (req: Request): Promise<ConfirmationYourDigitalAuthorisationRestoredViewData> {
        this.viewData.lang = getTranslationsForView(
            req.lang,
            constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE
        );
        const confirmedCompanyForAssociation: CompanyNameAndNumber = getExtraData(
            req.session,
            constants.CONFIRMED_COMPANY_FOR_ASSOCIATION
        );
        this.viewData.companyName = confirmedCompanyForAssociation.companyName.toUpperCase();
        this.viewData.companyNumber = confirmedCompanyForAssociation.companyNumber;

        return this.viewData;
    }
}
