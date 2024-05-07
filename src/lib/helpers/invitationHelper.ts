import { isOlderThan } from "../../lib/utils/date";
import * as constants from "../../constants";
import { Association, AssociationStatus, Invitation } from "private-api-sdk-node/dist/services/associations/types";

export const getNewestInvite = (invitations: Invitation[]): Invitation => {
    return invitations.reduce((a, b) =>
        new Date(a.invitedAt) > new Date(b.invitedAt) ? a : b);
};

export const getAssociationsWithValidInvitation = (associations: Association[]): Association[] => {
    return associations.filter(
        association => association.status === AssociationStatus.AWAITING_APPROVAL &&
            isValidInvitation(association.invitations));
};

const isValidInvitation = (invitations: Invitation[]): boolean => {
    const newestInvitation: Invitation = getNewestInvite(invitations);
    return !isOlderThan(newestInvitation.invitedAt, constants.NUMBER_OF_DAYS_INVITATION_IS_VALID);
};
