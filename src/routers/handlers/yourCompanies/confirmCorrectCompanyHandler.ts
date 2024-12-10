import { GenericHandler } from "../genericHandler";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import * as constants from "../../../constants";
import { formatForDisplay, buildAddress } from "../../../lib/utils/confirmCompanyUtils";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getFullUrl } from "../../../lib/utils/urlUtils";

export class ConfirmCorrectCompanyHandler extends GenericHandler {
    async execute (lang: string, companyProfile: CompanyProfile): Promise<Record<string, unknown>> {
        const localesServicei18nCh = i18nCh.getInstance();
        const translations = {
            ...getTranslationsForView(lang, constants.CONFIRM_COMPANY_PAGE),
            ...localesServicei18nCh.getResourceBundle(lang, constants.COMPANY_STATUS),
            ...localesServicei18nCh.getResourceBundle(lang, constants.COMPANY_TYPE)
        };
        this.viewData = this.getViewData(companyProfile, translations, lang);

        return Promise.resolve(this.viewData);
    }

    private getViewData (companyProfile: CompanyProfile, translations: AnyRecord, lang: string): ViewData {

        const formattedCompanyProfile = formatForDisplay(companyProfile, lang);

        return {
            ...formattedCompanyProfile,
            templateName: constants.CONFIRM_COMPANY_PAGE,
            registeredOfficeAddress: buildAddress(formattedCompanyProfile),
            backLinkHref: getFullUrl(constants.ADD_COMPANY_URL),
            backLinkWithClearForm: getFullUrl(constants.ADD_COMPANY_URL) + constants.CLEAR_FORM_TRUE,
            feedbackSource: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL),
            lang: translations
        };
    }
}
