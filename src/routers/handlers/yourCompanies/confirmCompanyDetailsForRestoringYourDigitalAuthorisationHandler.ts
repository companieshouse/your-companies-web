import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { FormattedCompanyProfile, ViewDataWithBackLink } from "../../../types/utilTypes";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { formatForDisplay, buildAddress } from "../../../lib/utils/confirmCompanyUtils";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { setExtraData } from "../../../lib/utils/sessionUtils";

interface ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationViewData extends ViewDataWithBackLink {
    backLinkWithClearForm: string;
    companyProfile: FormattedCompanyProfile | undefined;
    registeredOfficeAddress: string;
}

export class ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler extends GenericHandler {
    viewData: ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.CONFIRM_COMPANY_PAGE,
            backLinkHref: constants.LANDING_URL,
            backLinkWithClearForm: constants.LANDING_URL + constants.CLEAR_FORM_TRUE,
            lang: {},
            companyProfile: undefined,
            registeredOfficeAddress: ""
        };
    }

    async execute (req: Request, companyNumber: string): Promise<ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationViewData> {
        const localesServicei18nCh = i18nCh.getInstance();
        const companyProfile: CompanyProfile = await getCompanyProfile(companyNumber);
        setExtraData(req.session, `${constants.COMPANY_PROFILE}_${companyNumber}`, companyProfile);

        this.viewData.lang = {
            ...getTranslationsForView(req.lang, constants.CONFIRM_COMPANY_PAGE),
            ...localesServicei18nCh.getResourceBundle(req.lang, constants.COMPANY_STATUS),
            ...localesServicei18nCh.getResourceBundle(req.lang, constants.COMPANY_TYPE)
        };

        const formattedCompanyProfile = formatForDisplay(companyProfile, req.lang);
        this.viewData.companyProfile = formattedCompanyProfile;
        this.viewData.registeredOfficeAddress = buildAddress(formattedCompanyProfile);

        return Promise.resolve(this.viewData);
    }
}
