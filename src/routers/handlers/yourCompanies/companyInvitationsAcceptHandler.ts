import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { AnyRecord, ViewData } from "../../../types/util-types";

export class CompanyInvitationsAcceptHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        const translations = getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_ACCEPT_PAGE);
        const companyName = req.query[constants.COMPANY_NAME] as string;
        this.viewData = this.getViewData(translations, companyName);

        return Promise.resolve(this.viewData);
    }

    private getViewData (translations: AnyRecord, companyName: string): ViewData {
        return {
            lang: translations,
            yourCompaniesUrl: constants.LANDING_URL,
            companyName: companyName
        };
    }
}
