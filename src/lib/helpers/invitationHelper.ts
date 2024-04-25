import { Invitation } from "../../types/associations";

export const getNewestInvite = (associations: Invitation[]):Invitation => {
    return associations.reduce((a, b) =>
        new Date(a.invitedAt) > new Date(b.invitedAt) ? a : b);
};
