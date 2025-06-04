import { GenericHandler } from "../genericHandler";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { FormattedCompanyProfile, ViewDataWithBackLink } from "../../../types/utilTypes";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getFullUrl } from "../../../lib/utils/urlUtils";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { formatForDisplay, buildAddress } from "../../../lib/utils/confirmCompanyUtils";

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
            backLinkHref: getFullUrl(constants.LANDING_URL),
            backLinkWithClearForm: getFullUrl(constants.LANDING_URL) + constants.CLEAR_FORM_TRUE,
            lang: {},
            companyProfile: undefined,
            registeredOfficeAddress: ""
        };
    }

    async execute (lang: string, companyProfile: CompanyProfile): Promise<ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationViewData> {
        const localesServicei18nCh = i18nCh.getInstance();

        this.viewData.lang = {
            ...getTranslationsForView(lang, constants.CONFIRM_COMPANY_PAGE),
            ...localesServicei18nCh.getResourceBundle(lang, constants.COMPANY_STATUS),
            ...localesServicei18nCh.getResourceBundle(lang, constants.COMPANY_TYPE)
        };

        const formattedCompanyProfile = formatForDisplay(companyProfile, lang);
        this.viewData.companyProfile = formattedCompanyProfile;
        this.viewData.registeredOfficeAddress = buildAddress(formattedCompanyProfile);

        return Promise.resolve(this.viewData);
    }
}
