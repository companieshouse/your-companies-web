import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { BaseViewData } from "../../../types/utilTypes";

interface ConfirmationAuthorisationRemovedViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    yourCompaniesHref: string;
}

/**
 * Handles the logic for rendering the confirmation authorisation removed page.
 */
export class ConfirmationAuthorisationRemovedHandler extends GenericHandler {
    viewData: ConfirmationAuthorisationRemovedViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.CONFIRMATION_AUTHORISATION_REMOVED_PAGE,
            lang: {},
            companyName: "",
            companyNumber: "",
            yourCompaniesHref: ""
        };
    }

    /**
     * Executes the handler logic to prepare the view data for the confirmation authorisation removed page.
     *
     * @param req - The HTTP request object.
     * @returns A promise that resolves to the view data for the page.
     */
    async execute (req: Request): Promise<ConfirmationAuthorisationRemovedViewData> {
        this.viewData.lang = getTranslationsForView(req.lang, constants.CONFIRMATION_AUTHORISATION_REMOVED_PAGE);
        this.viewData.companyName = "Croissant Holdings Ltd";
        this.viewData.companyNumber = "FL123456";
        this.viewData.yourCompaniesHref = constants.LANDING_URL;
        return Promise.resolve(this.viewData);
    }
}
