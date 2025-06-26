import { Removal } from "../../src/types/removal";
import { AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";

export const mockConfirmedRemoval: Removal = {
    userEmail: "mario@example.com",
    companyNumber: "NI038379",
    userName: "Mario Rossi",
    status: AssociationStatus.CONFIRMED
};

export const mockAwaitingApprovalRemoval: Removal = {
    userEmail: "luigi@example.com",
    companyNumber: "NI038379",
    userName: "Luigi Verdi",
    status: AssociationStatus.AWAITING_APPROVAL
};

export const mockMigratedRemoval: Removal = {
    userEmail: "peach@example.com",
    companyNumber: "NI038379",
    userName: "Peach Toadstool",
    status: AssociationStatus.MIGRATED
};
