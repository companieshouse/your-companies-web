import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, BaseViewData } from "../../../types/utilTypes";

/**
 * Interface representing the view data for the RemoveCompanyConfirmedHandler.
 */
interface RemoveCompanyConfirmedViewData extends BaseViewData, CompanyNameAndNumber {
    buttonHref: string;
}

/**
 * Handler for the "Remove Company Confirmed" view.
 * This handler prepares the data required for rendering the confirmation page
 * after a company has been removed.
 */
export class RemoveCompanyConfirmedHandler extends GenericHandler {
    viewData: RemoveCompanyConfirmedViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVE_COMPANY_CONFIRMED,
            buttonHref: constants.LANDING_URL,
            lang: {},
            companyName: "",
            companyNumber: ""
        };
    }

    /**
     * Executes the handler logic to populate the view data.
     *
     * @param req - The HTTP request object.
     * @returns A promise resolving to the populated view data.
     */
    async execute (req: Request): Promise<RemoveCompanyConfirmedViewData> {
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_COMPANY_CONFIRMED);
        this.viewData.companyName = getExtraData(req.session, constants.LAST_REMOVED_COMPANY_NAME);
        this.viewData.companyNumber = getExtraData(req.session, constants.LAST_REMOVED_COMPANY_NUMBER);

        return Promise.resolve(this.viewData);
    }
}
