import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, BaseViewData } from "../../../types/utilTypes";

/**
 * Interface representing the view data for the RemoveThemselvesConfirmationHandler.
 */
interface RemoveThemselvesConfirmationViewData extends BaseViewData, CompanyNameAndNumber {
    buttonHref: string;
}

/**
 * Handler for rendering the confirmation view when a user removes themselves from a company.
 */
export class RemoveThemselvesConfirmationHandler extends GenericHandler {
    viewData: RemoveThemselvesConfirmationViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVED_THEMSELVES,
            buttonHref: constants.LANDING_URL,
            lang: {},
            companyName: "",
            companyNumber: ""
        };
    }

    /**
     * Executes the handler logic to populate the view data for the confirmation page.
     *
     * @param req - The HTTP request object.
     * @returns A promise resolving to the populated view data.
     */
    async execute (req: Request): Promise<RemoveThemselvesConfirmationViewData> {
        const companyNoLongerAssociated: CompanyNameAndNumber = getExtraData(
            req.session,
            constants.REMOVED_THEMSELVES_FROM_COMPANY
        );

        this.viewData.companyName = companyNoLongerAssociated.companyName;
        this.viewData.companyNumber = companyNoLongerAssociated.companyNumber;
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVED_THEMSELVES);

        return Promise.resolve(this.viewData);
    }
}
