import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { BaseViewData } from "../../../types/utilTypes";

interface CompanyAddSuccessViewData extends BaseViewData {
    companyName: string;
}

export class CompanyAddSuccessHandler extends GenericHandler {
    viewData: CompanyAddSuccessViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.COMPANY_ADD_SUCCESS_PAGE,
            lang: {},
            companyName: ""
        };
    }

    async execute (req: Request): Promise<CompanyAddSuccessViewData> {
        const companyNowAssociated = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        this.viewData.companyName = companyNowAssociated.companyName;
        this.viewData.lang = getTranslationsForView(req.lang, constants.COMPANY_ADD_SUCCESS_PAGE);
        return Promise.resolve(this.viewData);
    }

}
