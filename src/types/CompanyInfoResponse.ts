export interface CompanyInfoResponse {
    successBody: CompanyInfo[],
    errorBody: Errors
}

export interface CompanyInfo {
    companyName: string,
    companyNumber: string,
    companyStatus: string,
    dateOfCessation: string,
    dateOfCreation: string,
    dateOfDissolution: string,
    companyType: string,
    registeredAddress: OfficeAddress
}

export interface OfficeAddress {
    addressLine1: string,
    addressLine2: string,
    careOf: string,
    country: string,
    locality: string,
    poBox: string,
    postalCode: string
}

export interface Errors {
    errors: Set<Err>
}

export interface Err {
    error: string,
    errorValues: Map<string, string>,
    location: string,
    locationType: string,
    type: string
}
