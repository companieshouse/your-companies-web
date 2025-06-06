import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { BaseViewData } from "../../../types/utilTypes";

interface RemoveAuthorisationDoNotRemoveViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    cancelLinkHref: string;
}

/**
 * Handles the logic for rendering the company add success page.
 */
export class RemoveAuthorisationDoNotRestoreHandler extends GenericHandler {
    viewData: RemoveAuthorisationDoNotRemoveViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE,
            lang: {},
            companyName: "",
            companyNumber: "",
            cancelLinkHref: ""
        };
    }

    /**
     * Executes the handler logic to prepare the view data for the company add success page.
     *
     * @param req - The HTTP request object.
     * @returns A promise that resolves to the view data for the page.
     */
    async execute (req: Request): Promise<RemoveAuthorisationDoNotRemoveViewData> {
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE);
        this.viewData.companyName = "Croissant Holdings Ltd";
        this.viewData.companyNumber = "FL123456";
        this.viewData.cancelLinkHref = constants.MANAGE_AUTHORISED_PEOPLE_URL;
        return Promise.resolve(this.viewData);
    }
}
