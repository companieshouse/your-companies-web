import { validateRemoveAssociation } from "../../../../src/lib/validation/validateRemoveAssociation";
import { Removal } from "../../../../src/types/removal";
import { CONFIRM } from "../../../../src/constants";

describe("validateRemoveAssociation", () => {
    it("should return true if the request is valid", () => {
        const removal: Removal = {
            removePerson: CONFIRM,
            userEmail: "bob@bob.com",
            companyNumber: "AB123456"
        };
        const companyNumber = "AB123456";
        const result = validateRemoveAssociation(removal, companyNumber);
        expect(result).toBeTruthy;
    });
    it("should return false if the company numbers do not match", () => {
        const removal: Removal = {
            removePerson: CONFIRM,
            userEmail: "bob@bob.com",
            companyNumber: "AB123456"
        };
        const companyNumber = "XYZ123456";
        const result = validateRemoveAssociation(removal, companyNumber);
        expect(result).toBeFalsy;
    });

    it("should return false if the removal.removePerson status is not confirmed", () => {
        const removal: Removal = {
            removePerson: "BAD_STATUS",
            userEmail: "bob@bob.com",
            companyNumber: "AB123456"
        };
        const companyNumber = "XYZ123456";
        const result = validateRemoveAssociation(removal, companyNumber);
        expect(result).toBeFalsy;
    });
});
