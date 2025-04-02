import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import * as constants from "../../../constants";
import { BaseViewData } from "../../../types/utilTypes";
import { getTranslationsForView } from "../../../lib/utils/translations";

interface SomethingWentWrongViewData extends BaseViewData {
    title: string;
    csrfErrors: boolean;
}

export class SomethingWentWrongHandler extends GenericHandler {
    viewData: SomethingWentWrongViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.SERVICE_UNAVAILABLE,
            lang: {},
            csrfErrors: false,
            title: ""
        };
    }

    async execute (req: Request): Promise<SomethingWentWrongViewData> {
        const translations = getTranslationsForView(req.lang || "en", constants.SERVICE_UNAVAILABLE);
        const csrfError = this.isCsrfError(req);
        this.viewData.lang = translations;
        this.viewData.csrfErrors = csrfError;
        this.viewData.title = `${translations.sorry_something_went_wrong}${translations.title_end}`;

        return Promise.resolve(this.viewData);
    }

    private isCsrfError (req: Request): boolean {
        return Object.prototype.hasOwnProperty.call(req.query, constants.CSRF_ERRORS);
    }
}
