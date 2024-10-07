export type AuthorisedPerson = {
    authorisedPersonCompanyName: string,
    authorisedPersonEmailAddress: string,
}

export enum AssociationStatus {
    CONFIRMED = "confirmed",
    REMOVED = "removed",
    AWAITING_APPROVAL = "awaiting-approval"
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
