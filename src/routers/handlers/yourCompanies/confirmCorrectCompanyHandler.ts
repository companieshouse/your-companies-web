import { GenericHandler } from "../genericHandler";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import * as constants from "../../../constants";
import { formatForDisplay, buildAddress } from "../../../lib/utils/confirmCompanyUtils";
import * as i18next from "i18next";
import { AnyRecord, ViewData } from "../../../types/util-types";

export class ConfirmCorrectCompanyHandler extends GenericHandler {
    async execute (translateFn: i18next.TFunction, companyProfile: CompanyProfile, lang: string): Promise<Record<string, unknown>> {
        const translations = {
            ...translateFn(constants.COMMON, { returnObjects: true }),
            ...translateFn(constants.CONFIRM_COMPANY_PAGE, { returnObjects: true }),
            ...translateFn(constants.COMPANY_STATUS, { returnObjects: true }),
            ...translateFn(constants.COMPANY_TYPE, { returnObjects: true })
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
            feedbackSource: constants.YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL,
            lang: translations
        };
    }
}
