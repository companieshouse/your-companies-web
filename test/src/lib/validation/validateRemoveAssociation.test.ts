import { validateRemoveAssociation } from "../../../../src/lib/validation/validateRemoveAssociation";
import { Removal } from "../../../../src/types/removal";
import { Association } from "private-api-sdk-node/dist/services/associations/types";
import { userAssociations } from "../../../mocks/associations.mock";
import { CONFIRM } from "../../../../src/constants";

describe("validateRemoveAssociation", () => {
    it("should return true if the request is valid", () => {
        // Given
        const association:Association = userAssociations.items[0];
        const removal: Removal = {
            removePerson: CONFIRM,
            userEmail: "bob@bob.com",
            companyNumber: "AB123456"
        };
        const companyNumber = "AB123456";
        // When
        const result = validateRemoveAssociation(association, removal, companyNumber);
        // Then
        expect(result).toBeTruthy;
    });
    it("should return false if the company numbers do not match", () => {
        // Given
        const association:Association = userAssociations.items[0];
        const removal: Removal = {
            removePerson: CONFIRM,
            userEmail: "bob@bob.com",
            companyNumber: "AB123456"
        };
        const companyNumber = "XYZ123456";
        // When
        const result = validateRemoveAssociation(association, removal, companyNumber);
        // Then
        expect(result).toBeFalsy;
    });
    it("should return false if the association is undefined", () => {
        // Given
        const removal: Removal = {
            removePerson: CONFIRM,
            userEmail: "bob@bob.com",
            companyNumber: "AB123456"
        };
        const companyNumber = "AB123456";
        // When
        const result = validateRemoveAssociation(undefined, removal, companyNumber);
        // Then
        expect(result).toBeFalsy;
    });
    it("should return false if the removal.removePerson status is not confirmed", () => {
        // Given
        const association:Association = userAssociations.items[0];
        const removal: Removal = {
            removePerson: "BAD_STATUS",
            userEmail: "bob@bob.com",
            companyNumber: "AB123456"
        };
        const companyNumber = "XYZ123456";
        // When
        const result = validateRemoveAssociation(association, removal, companyNumber);
        // Then
        expect(result).toBeFalsy;
    });
});
