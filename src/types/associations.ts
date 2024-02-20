export interface Associations {
    items: Association[];
}

export interface Association {
    id: string;
    userId: string;
    userEmail: string;
    displayName: string;
    companyNumber: string;
    companyName: string;
    status: string;
}

export type AuthorisedPerson = {
    authorisedPersonCompanyName: string,
    authorisedPersonEmailAddress: string,
}
