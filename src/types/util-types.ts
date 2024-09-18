export type AnyRecord = Record<string, unknown>;

export type ViewData = {
    lang: AnyRecord;
    errors?:
    | {
        [key: string]: {
            text: string;
        };
    }
    | unknown;
    companyNumber?: string;
    companyName?: string;
    backLinkHref?: string;
    [key: string]: unknown;
};

export type CompanyNameAndNumber = {
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
