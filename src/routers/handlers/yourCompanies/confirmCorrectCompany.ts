import { GenericHandler } from "../generic";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import * as constants from "../../../constants";
import { formatForDisplay, buildAddress } from "../../../services/confirmCompanyService";
import * as i18next from "i18next";

export class ConfirmCorrectCompany extends GenericHandler {
    async execute (translateFn:i18next.TFunction, companyProfile:CompanyProfile, lang:string): Promise<Object> {
        this.viewData = this.getViewData(companyProfile, lang);
        this.viewData.lang = {
            ...translateFn(constants.COMMON, { returnObjects: true }),
            ...translateFn(constants.CONFIRM_COMPANY_LANG, { returnObjects: true }),
            ...translateFn(constants.COMPANY_STATUS_LANG, { returnObjects: true }),
            ...translateFn(constants.COMPANY_TYPE_LANG, { returnObjects: true })
        };
        return Promise.resolve(this.viewData);
    }

    private getViewData (companyProfile:CompanyProfile, lang:string): any {

        const formattedCompanyProfile = formatForDisplay(companyProfile, lang);

        return {
            ...formattedCompanyProfile,
            registeredOfficeAddress: buildAddress(formattedCompanyProfile),
            backLinkHref: constants.YOUR_COMPANIES_ADD_COMPANY_URL,
            feedbackSource: constants.YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL
        };
    }
}
