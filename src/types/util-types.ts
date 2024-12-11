export type AnyRecord = Record<string, unknown>;

export interface BaseViewData {
    lang: AnyRecord;
    templateName: string;
    errors?: unknown;
}

export interface ViewDataWithBackLink extends BaseViewData {
    backLinkHref: string;
}

export interface CompanyNameAndNumber {
    companyName: string;
    companyNumber: string;
}

export type OfficeAddress = {
    addressLineOne: string,
    addressLineTwo: string,
    locality: string,
    region: string,
    country: string,
    postalCode: string,
    poBox: string,
    premises: string
}

export type FormattedCompanyProfile = {
    companyNumber: string,
    companyName: string,
    type: string,
    companyStatus: string,
    dateOfCreation: string,
    registeredOfficeAddress: OfficeAddress
}
