export interface Association {
    id: string;
    userId: string;
    userEmail: string;
    displayName: string;
    companyNumber: string;
    companyName: string;
    status: string;
    invitations?: [
        {
          "invited_by": string,
          "invited_at": string
        }
      ]
}

export interface Associations  {
    items: Association[];
}

export type AuthorisedPerson = {
    authorisedPersonCompanyName: string,
    authorisedPersonEmailAddress: string,
}
