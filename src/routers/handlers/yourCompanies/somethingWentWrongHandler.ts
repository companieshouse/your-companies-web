import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import * as constants from "../../../constants";
import { BaseViewData } from "../../../types/utilTypes";
import { getTranslationsForView } from "../../../lib/utils/translations";

/**
 * Interface representing the view data for the "Something Went Wrong" page.
 */
interface SomethingWentWrongViewData extends BaseViewData {
    title: string;
    csrfErrors: boolean;
}

/**
 * Handler for rendering the "Something Went Wrong" page.
 * This handler is responsible for preparing the view data and translations
 * required to display the error page.
 */
export class SomethingWentWrongHandler extends GenericHandler {
    viewData: SomethingWentWrongViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.SERVICE_UNAVAILABLE,
            lang: {},
            csrfErrors: false,
            title: ""
        };
    }

    /**
     * Executes the handler logic to prepare the view data for the error page.
     *
     * @param req - The HTTP request object.
     * @returns A promise that resolves to the prepared view data.
     */
    async execute (req: Request): Promise<SomethingWentWrongViewData> {
        const translations = getTranslationsForView(req.lang || "en", constants.SERVICE_UNAVAILABLE);
        const csrfError = this.isCsrfError(req);
        this.viewData.lang = translations;
        this.viewData.csrfErrors = csrfError;
        this.viewData.title = `${translations.sorry_something_went_wrong}${translations.title_end}`;

        return Promise.resolve(this.viewData);
    }

    private isCsrfError (req: Request): boolean {
        return Object.hasOwn(req.query, constants.CSRF_ERRORS);
    }
}
