import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, BaseViewData } from "../../../types/util-types";
import { getFullUrl } from "../../../lib/utils/urlUtils";

interface RemoveCompanyConfirmedViewData extends BaseViewData, CompanyNameAndNumber {
    buttonHref: string;
}

export class RemoveCompanyConfirmedHandler extends GenericHandler {
    viewData: RemoveCompanyConfirmedViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVE_COMPANY_CONFIRMED,
            buttonHref: getFullUrl(constants.LANDING_URL),
            lang: {},
            companyName: "",
            companyNumber: ""
        };
    }

    async execute (req: Request): Promise<RemoveCompanyConfirmedViewData> {
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_COMPANY_CONFIRMED);
        this.viewData.companyName = getExtraData(req.session, constants.LAST_REMOVED_COMPANY_NAME);
        this.viewData.companyNumber = getExtraData(req.session, constants.LAST_REMOVED_COMPANY_NUMBER);

        return Promise.resolve(this.viewData);
    }
}
