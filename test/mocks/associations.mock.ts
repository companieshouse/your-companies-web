import { Associations } from "../../src/types/associations";

jest.mock("../../src/services/userCompanyAssociationService");

export const userAssociations: Associations = {
    items: [
        {
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "ABC Ltd"
        },
        {
            id: "2345678901",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "AB123456",
            companyName: "XYZ Ltd"
        }
    ]
} as Associations;

export const emptyUserAssociations: Associations = {
    items: []
};
