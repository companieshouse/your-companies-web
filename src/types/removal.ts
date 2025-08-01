import { AssociationStatus } from "@companieshouse/api-sdk-node/dist/services/associations/types";

export interface Removal {
    userEmail: string;
    userName: string;
    companyNumber: string;
    status: AssociationStatus;
}
