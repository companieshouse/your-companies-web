import { GenericHandler } from "../genericHandler";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import * as constants from "../../../constants";
import { formatForDisplay, buildAddress } from "../../../lib/utils/confirmCompanyUtils";
import * as i18next from "i18next";
import { AnyRecord, ViewData } from "../../../types/util-types";
import {LocalesService} from "@companieshouse/ch-node-utils";

export class ConfirmCorrectCompanyHandler extends GenericHandler {
    async execute (lang: string, companyProfile: CompanyProfile): Promise<Record<string, unknown>> {
        const localesServicei18nCh = LocalesService.getInstance().i18nCh;
        const translations = {
            ...localesServicei18nCh.getResourceBundle(lang, constants.COMMON),
            ...localesServicei18nCh.getResourceBundle(lang, constants.CONFIRM_COMPANY_PAGE),
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
            registeredOfficeAddress: buildAddress(formattedCompanyProfile),
            backLinkHref: constants.YOUR_COMPANIES_ADD_COMPANY_URL,
            backLinkWithClearForm: constants.YOUR_COMPANIES_ADD_COMPANY_URL + constants.CLEAR_FORM_TRUE,
            feedbackSource: constants.YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL,
            lang: translations,
            matomoConfirmAndContinueButton: constants.MATOMO_CONFIRM_AND_CONTINUE_BUTTON,
            matomoChooseDifferentCompanyLink: constants.MATOMO_CHOOSE_DIFFERENT_COMPANY_LINK
        };
    }
}
