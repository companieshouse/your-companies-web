import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { ViewData } from "../../../types/util-types";

export class RemoveThemselvesConfirmationHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        this.viewData = await this.getViewData(req);
        this.viewData.lang = getTranslationsForView(
            req.t,
            constants.REMOVED_THEMSELVES
        );
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const companyNoLongerAssociated = getExtraData(req.session, constants.REMOVED_THEMSELVES_FROM_COMPANY);
        return Promise.resolve({
            ...companyNoLongerAssociated,
            buttonHref: constants.LANDING_URL
        } as ViewData);
    }
}
