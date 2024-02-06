import { GenericHandler } from "../generic";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { formatForDisplay, buildAddress } from "../../../services/confirmCompanyService";
import * as i18next from "i18next";

export class ConfirmCorrectCompany extends GenericHandler {
    async execute (translateFn:i18next.TFunction, companyProfile:CompanyProfile): Promise<Object> {
        this.viewData = this.getViewData(companyProfile);
        this.viewData.lang = getTranslationsForView(
            translateFn,
            constants.CONFIRM_COMPANY_LANG
        );
        return Promise.resolve(this.viewData);
    }

    private getViewData (companyProfile:CompanyProfile): any {

        const formattedCompanyProfile = formatForDisplay(companyProfile);

        return {
            ...formattedCompanyProfile,
            registeredOfficeAddress: buildAddress(formattedCompanyProfile),
            backLinkHref: constants.YOUR_COMPANIES_ADD_COMPANY_URL,
            feedbackSource: constants.YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL
        };
    }
}
