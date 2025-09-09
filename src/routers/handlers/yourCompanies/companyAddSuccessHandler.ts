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
     * Executes the handler logic to prepare the view data for the company add success page.
     *
     * @param req - The HTTP request object.
     * @returns A promise that resolves to the view data for the page.
     */
    async execute (req: Request): Promise<CompanyAddSuccessViewData> {
        const companyNowAssociated = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        this.viewData.companyName = companyNowAssociated.companyName.toUpperCase();
        this.viewData.companyNumber = companyNowAssociated.companyNumber;
        this.viewData.lang = getTranslationsForView(req.lang, constants.COMPANY_ADD_SUCCESS_PAGE);
        this.viewData.buttonHref = constants.LANDING_URL;
        return Promise.resolve(this.viewData);
    }
}
