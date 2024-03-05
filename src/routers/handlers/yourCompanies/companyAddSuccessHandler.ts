import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { ViewData } from "../../../types/util-types";

export class CompanyAddSuccessHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        this.viewData = await this.getViewData(req);
        this.viewData.lang = getTranslationsForView(
            req.t,
            constants.COMPANY_ADD_SUCCESS_PAGE
        );
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const companyNowAssociated = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        return Promise.resolve({
            companyName: companyNowAssociated.companyName
        } as ViewData);
    }
}
