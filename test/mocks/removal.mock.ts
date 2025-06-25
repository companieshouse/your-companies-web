import { Removal } from "../../src/types/removal";
import { companyAssociations } from "../mocks/associations.mock";

export const mockRemovalWithEmailAsName: Removal = {
    userEmail: companyAssociations.items[1].userEmail,
    companyNumber: companyAssociations.items[1].companyNumber,
    userName: companyAssociations.items[1].userEmail,
    status: companyAssociations.items[1].status
};

export const mockRemovalWithName: Removal = {
    userEmail: companyAssociations.items[1].userEmail,
    companyNumber: companyAssociations.items[1].companyNumber,
    userName: "John Smith",
    status: companyAssociations.items[1].status
};
