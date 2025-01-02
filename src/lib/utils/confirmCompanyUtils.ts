import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { toReadableFormat } from "./date";
import { FormattedCompanyProfile, OfficeAddress } from "../../types/utilTypes";

export const formatForDisplay = (companyProfile: CompanyProfile, lang: string): FormattedCompanyProfile => {
    const registeredOfficeAddress: OfficeAddress = {
        addressLineOne: formatTitleCase(companyProfile.registeredOfficeAddress.addressLineOne),
        addressLineTwo: formatTitleCase(companyProfile.registeredOfficeAddress.addressLineTwo),
        locality: formatTitleCase(companyProfile.registeredOfficeAddress.locality),
        region: formatTitleCase(companyProfile.registeredOfficeAddress.region),
        country: formatTitleCase(companyProfile.registeredOfficeAddress.country),
        postalCode: companyProfile.registeredOfficeAddress.postalCode ? companyProfile.registeredOfficeAddress.postalCode.toUpperCase() : "",
        poBox: companyProfile.registeredOfficeAddress.poBox ? companyProfile.registeredOfficeAddress.poBox.toUpperCase() : "",
        premises: companyProfile.registeredOfficeAddress.premises
    };

    return {
        companyNumber: companyProfile.companyNumber,
        companyName: companyProfile.companyName,
        type: companyProfile.type,
        companyStatus: companyProfile.companyStatus,
        dateOfCreation: toReadableFormat(companyProfile.dateOfCreation, lang),
        registeredOfficeAddress: registeredOfficeAddress
    };
};

export const formatTitleCase = (str: string | undefined): string => {
    if (!str) {
        return "";
    }

    return str.replace(
        /\w\S*/g, (word) => {
            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
        });
};

export const buildAddress = (formattedCompanyProfile: FormattedCompanyProfile): string => {
    const addressArray: string[] = [
        formattedCompanyProfile.registeredOfficeAddress.poBox,
        formattedCompanyProfile.registeredOfficeAddress.premises,
        formattedCompanyProfile.registeredOfficeAddress.addressLineOne,
        formattedCompanyProfile.registeredOfficeAddress.addressLineTwo,
        formattedCompanyProfile.registeredOfficeAddress.locality,
        formattedCompanyProfile.registeredOfficeAddress.region,
        formattedCompanyProfile.registeredOfficeAddress.country,
        formattedCompanyProfile.registeredOfficeAddress.postalCode
    ];

    let address = "";
    for (const addressValue of addressArray) {
        if (addressValue) {
            address += `${addressValue}<br>`;
        }
    }
    return address;
};
