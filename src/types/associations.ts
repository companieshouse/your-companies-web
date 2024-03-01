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
            "invitedBy": string,
            "invitedAy": string
        }
    ]
}

export interface Associations {
    items: Association[];
}

export type AuthorisedPerson = {
    authorisedPersonCompanyName: string,
    authorisedPersonEmailAddress: string,
}

export const AssociationStatus = {
    CONFIRMED: "confirmed",
    REMOVED: "removed",
    AWAITING_APPROVAL: "awaiting-approval"
} as const;

export type AssociationStatus = typeof AssociationStatus[keyof typeof AssociationStatus];
