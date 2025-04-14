import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { toReadableFormat } from "./date";
import { FormattedCompanyProfile, OfficeAddress } from "../../types/utilTypes";

export const formatForDisplay = (companyProfile: CompanyProfile, lang: string): FormattedCompanyProfile => {
    const registeredOfficeAddress = formatRegisteredOfficeAddress(companyProfile.registeredOfficeAddress);

    return {
        companyNumber: companyProfile.companyNumber,
        companyName: companyProfile.companyName,
        type: companyProfile.type,
        companyStatus: companyProfile.companyStatus,
        dateOfCreation: toReadableFormat(companyProfile.dateOfCreation, lang),
        registeredOfficeAddress
    };
};

const formatRegisteredOfficeAddress = (address: CompanyProfile["registeredOfficeAddress"]): OfficeAddress => ({
    addressLineOne: formatTitleCase(address.addressLineOne),
    addressLineTwo: formatTitleCase(address.addressLineTwo),
    locality: formatTitleCase(address.locality),
    region: formatTitleCase(address.region),
    country: formatTitleCase(address.country),
    postalCode: address.postalCode?.toUpperCase() || "",
    poBox: address.poBox?.toUpperCase() || "",
    premises: address.premises
});

export const formatTitleCase = (str: string | undefined): string =>
    str
        ? str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
        : "";

/**
 * Constructs a formatted address string from a given company profile.
 *
 * @param formattedCompanyProfile - An object containing the company's profile information,
 * including its registered office address.
 *
 * @returns A string representing the full address of the company, with each address component
 * separated by an HTML line break (`<br>`). Empty or undefined address components are excluded.
 *
 * The function processes the `registeredOfficeAddress` property of the `formattedCompanyProfile` object,
 * which contains various address components such as:
 * - `poBox`: The post office box number.
 * - `premises`: The premises or building name/number.
 * - `addressLineOne`: The first line of the address.
 * - `addressLineTwo`: The second line of the address (if any).
 * - `locality`: The city or town.
 * - `region`: The state or region.
 * - `country`: The country name.
 * - `postalCode`: The postal or ZIP code.
 *
 * These components are combined into an array, filtered to remove falsy values (e.g., `null`, `undefined`, or empty strings),
 * and joined with `<br>` to create the final formatted address string.
 */
export const buildAddress = (formattedCompanyProfile: FormattedCompanyProfile): string => {
    const { registeredOfficeAddress } = formattedCompanyProfile;

    const addressArray = [
        registeredOfficeAddress.poBox,
        registeredOfficeAddress.premises,
        registeredOfficeAddress.addressLineOne,
        registeredOfficeAddress.addressLineTwo,
        registeredOfficeAddress.locality,
        registeredOfficeAddress.region,
        registeredOfficeAddress.country,
        registeredOfficeAddress.postalCode
    ];

    return addressArray.filter(Boolean).join("<br>");
};
