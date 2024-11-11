import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { ViewData } from "../../../types/util-types";

export class RemoveCompanyConfirmedHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        this.viewData = await this.getViewData(req);
        this.viewData.lang = getTranslationsForView(
            req.lang,
            constants.REMOVE_COMPANY_CONFIRMED
        );
        this.viewData.templateName = constants.REMOVE_COMPANY_CONFIRMED;
        this.viewData.buttonHref = constants.LANDING_URL;
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const companyName = getExtraData(req.session, constants.LAST_REMOVED_COMPANY_NAME);
        const companyNumber = getExtraData(req.session, constants.LAST_REMOVED_COMPANY_NUMBER);

        return Promise.resolve({
            companyName,
            companyNumber
        } as ViewData);
    }
}
