import { Request } from "express";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { GenericHandler } from "../genericHandler";
import { ViewData } from "../../../types/util-types";

export class CompanyInvitationsDeclineHandler extends GenericHandler {

    async execute (req: Request): Promise<ViewData> {
        this.viewData = this.getViewData(req);
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): ViewData {
        const lang = getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_DECLINE_PAGE);
        return {
            companyName: req.query[constants.COMPANY_NAME] as string,
            buttonLinkHref: constants.LANDING_URL,
            lang: lang
        };
    }
}
