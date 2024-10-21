import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import * as constants from "../../../constants";
import { ViewData } from "../../../types/util-types";
import { getTranslationsForView } from "../../../lib/utils/translations";

export class SomethingWentWrongHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        this.viewData = this.getViewData(req);
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): ViewData {
        const translations = getTranslationsForView(req.lang || "en", constants.SERVICE_UNAVAILABLE);

        return {
            lang: translations,
            csrfErrors: true,
            title: `${translations.sorry_something_went_wrong}${translations.title_end}`,
            templateName: constants.SERVICE_UNAVAILABLE
        };
    }

}
