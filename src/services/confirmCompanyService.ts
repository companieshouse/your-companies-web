import { lookupCompanyStatus, lookupCompanyType } from "../lib/utils/api_enumerations";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { toReadableFormat } from "../lib/utils/date";

export const formatForDisplay = (companyProfile: CompanyProfile) => {
    const registeredOfficeAddress = {
        addressLineOne: formatTitleCase(companyProfile.registeredOfficeAddress.addressLineOne),
        addressLineTwo: formatTitleCase(companyProfile.registeredOfficeAddress.addressLineTwo),
        locality: formatTitleCase(companyProfile.registeredOfficeAddress.locality),
        region: formatTitleCase(companyProfile.registeredOfficeAddress.region),
        country: formatTitleCase(companyProfile.registeredOfficeAddress.country),
        postalCode: companyProfile.registeredOfficeAddress.postalCode ? companyProfile.registeredOfficeAddress.postalCode.toUpperCase() : null,
        poBox: companyProfile.registeredOfficeAddress.poBox ? companyProfile.registeredOfficeAddress.poBox.toUpperCase() : null
    };

    return {
        companyNumber: companyProfile.companyNumber,
        companyName: companyProfile.companyName,
        type: lookupCompanyType(companyProfile.type),
        companyStatus: lookupCompanyStatus(companyProfile.companyStatus),
        dateOfCreation: toReadableFormat(companyProfile.dateOfCreation),
        registeredOfficeAddress: registeredOfficeAddress
    };
};

export const formatTitleCase = (str: string|undefined): string => {
    if (!str) {
        return "";
    }

    return str.replace(
        /\w\S*/g, (word) => {
            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
        });
};

export const buildAddress = (formattedCompanyProfile: any): string => {
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