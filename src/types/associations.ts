export type AuthorisedPerson = {
    authorisedPersonCompanyName: string,
    authorisedPersonEmailAddress: string,
}

export enum AssociationState {
    COMPANY_ASSOCIATED_WITH_USER = "COMPANY_ASSOCIATED_WITH_USER",
    COMPANY_AWAITING_ASSOCIATION_WITH_USER = "COMPANY_AWAITING_ASSOCIATION_WITH_USER",
    COMPANY_WAS_ASSOCIATED_WITH_USER = "COMPANY_WAS_ASSOCIATED_WITH_USER",
    COMPANY_NOT_ASSOCIATED_WITH_USER = "COMPANY_NOT_ASSOCIATED_WITH_USER"
}

export type AssociationStateWithId = {
    state: AssociationState.COMPANY_ASSOCIATED_WITH_USER |
    AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER |
    AssociationState.COMPANY_WAS_ASSOCIATED_WITH_USER;
    associationId: string;
};

export type AssociationStateWithoutId = {
    state: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER;
};

export type AssociationStateResponse = AssociationStateWithId | AssociationStateWithoutId;

export const CompanyStatuses = {
    ACTIVE: "active",
    DISSOLVED: "dissolved",
    LIQUIDATION: "liquidation",
    RECEIVERSHIP: "receivership",
    CONVERTED_CLOSED: "converted-closed",
    VOLUNTARY_ARRANGEMENT: "voluntary-arrangement",
    INSOLVENCY_PROCEEDINGS: "insolvency-proceedings",
    ADMINISTRATION: "administration",
    OPEN: "open",
    CLOSED: "closed",
    REGISTERED: "registered",
    REMOVED: "removed"
} as const;
