import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, BaseViewData } from "../../../types/util-types";
import { getFullUrl } from "../../../lib/utils/urlUtils";

interface RemoveThemselvesConfirmationViewData extends BaseViewData, CompanyNameAndNumber {
    buttonHref: string;
}

export class RemoveThemselvesConfirmationHandler extends GenericHandler {
    viewData: RemoveThemselvesConfirmationViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVED_THEMSELVES,
            buttonHref: getFullUrl(constants.LANDING_URL),
            lang: {},
            companyName: "",
            companyNumber: ""
        };
    }

    async execute (req: Request): Promise<RemoveThemselvesConfirmationViewData> {
        const companyNoLongerAssociated: CompanyNameAndNumber = getExtraData(req.session, constants.REMOVED_THEMSELVES_FROM_COMPANY);
        this.viewData.companyName = companyNoLongerAssociated.companyName;
        this.viewData.companyNumber = companyNoLongerAssociated.companyNumber;
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVED_THEMSELVES);

        return Promise.resolve(this.viewData);
    }
}
