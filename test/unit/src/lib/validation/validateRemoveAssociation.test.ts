import { validateRemoveAssociation } from "../../../../../src/lib/validation/validateRemoveAssociation";
import { CONFIRM } from "../../../../../src/constants";

describe("validateRemoveAssociation", () => {
    test.each([
        // Given
        {
            returnValue: true,
            condition: "the request is valid",
            removal: {
                removePerson: CONFIRM,
                userEmail: "bob@bob.com",
                companyNumber: "AB123456"
            },
            companyNumber: "AB123456"
        },
        {
            returnValue: false,
            condition: "the company numbers do not match",
            removal: {
                removePerson: CONFIRM,
                userEmail: "bob@bob.com",
                companyNumber: "AB123456"
            },
            companyNumber: "XYZ123456"
        },
        {
            returnValue: false,
            condition: "the removal.removePerson status is not confirmed",
            removal: {
                removePerson: "BAD_STATUS",
                userEmail: "bob@bob.com",
                companyNumber: "AB123456"
            },
            companyNumber: "XYZ123456"
        }
    ])("should return $returnValue if $condition",
        ({ returnValue, removal, companyNumber }) => {
            // When
            const result = validateRemoveAssociation(removal, companyNumber);
            // Then
            expect(result).toEqual(returnValue);
        });
});
