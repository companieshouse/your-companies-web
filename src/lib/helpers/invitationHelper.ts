import { Invitation } from "private-api-sdk-node/dist/services/associations/types";

export const getNewestInvite = (invitations: Invitation[]):Invitation => {
    return invitations.reduce((a, b) =>
        new Date(a.invitedAt) > new Date(b.invitedAt) ? a : b);
};
