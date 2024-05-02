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
    COMPNANY_ASSOCIATED_WITH_USER = "COMPNANY_ASSOCIATED_WITH_USER",
    COMPNANY_AWAITING_ASSOCIATION_WITH_USER = "COMPNANY_AWAITING_ASSOCIATION_WITH_USER",
    COMPNANY_WAS_ASSOCIATED_WITH_USER = "COMPNANY_WAS_ASSOCIATED_WITH_USER",
    COMPNANY_NOT_ASSOCIATED_WITH_USER = "COMPNANY_NOT_ASSOCIATED_WITH_USER"
}

export interface AssociationStateResponse {
    state: AssociationState,
    associationId?: string
}
