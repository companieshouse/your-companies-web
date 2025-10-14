import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { BaseViewData } from "../../../types/utilTypes";

interface CompanyAddSuccessViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    buttonHref: string;
}

/**
 * Handles the logic for rendering the company add success page.
 */
export class CompanyAddSuccessHandler extends GenericHandler {
    viewData: CompanyAddSuccessViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.COMPANY_ADD_SUCCESS_PAGE,
            lang: {},
            companyName: "",
            companyNumber: "",
            buttonHref: ""
        };
    }

    /**
     * Prepares and returns the view data for the company add success page.
     *
     * Retrieves the company information from the session, checks for invalid navigation,
     * populates the view data with the company name, number, translations, and button link.
     *
     * @param req - The HTTP request object containing session and language information.
     * @returns A promise that resolves to the populated view data for the company add success page.
     * @throws Error if the user navigated from the confirm company details page and the authentication code is already present in the session.
     */
    async execute (req: Request): Promise<CompanyAddSuccessViewData> {
        const companyNowAssociated = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);

        if (req.headers.referer?.includes(constants.CONFIRM_COMPANY_DETAILS_URL)) {
            throw new Error(
                `Failed to add company with companyNumber '${companyNowAssociated.companyNumber}': authentication code already present in session.`
            );
        }

        this.viewData.companyName = companyNowAssociated.companyName.toUpperCase();
        this.viewData.companyNumber = companyNowAssociated.companyNumber;
        this.viewData.lang = getTranslationsForView(req.lang, constants.COMPANY_ADD_SUCCESS_PAGE);
        this.viewData.buttonHref = constants.LANDING_URL;
        return this.viewData;
    }
}
