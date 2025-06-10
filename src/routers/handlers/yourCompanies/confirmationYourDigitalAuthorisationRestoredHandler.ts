import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { BaseViewData, CompanyNameAndNumber } from "../../../types/utilTypes";
import { getExtraData } from "../../../lib/utils/sessionUtils";

interface ConfirmationYourDigitalAuthorisationRestoredViewData extends BaseViewData, CompanyNameAndNumber {
    buttonHref: string;
}

export class ConfirmationYourDigitalAuthorisationRestoredHandler extends GenericHandler {
    viewData: ConfirmationYourDigitalAuthorisationRestoredViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE,
            lang: {},
            companyName: "",
            companyNumber: "",
            buttonHref: constants.LANDING_URL
        };
    }

    async execute (req: Request): Promise<ConfirmationYourDigitalAuthorisationRestoredViewData> {
        this.viewData.lang = getTranslationsForView(req.lang, constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE);
        const confirmedCompanyForAssociation: CompanyNameAndNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        this.viewData.companyName = confirmedCompanyForAssociation.companyName;
        this.viewData.companyNumber = confirmedCompanyForAssociation.companyNumber;

        return Promise.resolve(this.viewData);
    }
}
