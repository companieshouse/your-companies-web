import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";

export class CompanyAddSuccessHandler extends GenericHandler {
    async execute (req: Request, response: Response): Promise<Record<string, any>> {
        this.viewData = await this.getViewData(req, response);
        this.viewData.lang = getTranslationsForView(
            req.t,
            constants.COMPANY_ADD_SUCCESS_PAGE
        );
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request, response: Response): Promise<Record<string, any>> {
        const companyNowAssociated = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        return Promise.resolve({
            companyName: companyNowAssociated.companyName
        });
    }
}
