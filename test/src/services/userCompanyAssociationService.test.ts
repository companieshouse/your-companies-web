import { COMPNANY_ASSOCIATED_WITH_USER, COMPNANY_NOT_ASSOCIATED_WITH_USER } from "../../../src/constants";
import { getUserAssociations, isCompanyAssociatedWithUser } from "../../../src/services/userCompanyAssociationService";
import { Associations } from "../../../src/types/associations";

describe("User Company Association Service", () => {
    describe("isCompanyAssociatedWithUser", () => {
        it("should return confirmation if the company is associated with the user", () => {
            // Given
            const companyNumber = "NI038379";
            const userEmailAddress = "test@test.com";
            // When
            const result = isCompanyAssociatedWithUser(companyNumber, userEmailAddress);
            // Then
            expect(result).resolves.toEqual(COMPNANY_ASSOCIATED_WITH_USER);
        });

        it("should return negation if the company is not associated with the user", () => {
            // Given
            const companyNumber = "NI012345";
            const userEmailAddress = "test@test.com";
            // When
            const result = isCompanyAssociatedWithUser(companyNumber, userEmailAddress);
            // Then
            expect(result).resolves.toEqual(COMPNANY_NOT_ASSOCIATED_WITH_USER);
        });
    });

    describe("getUserAssociations", () => {
        it("should return associations for the user if there are any", () => {
            // Given
            const userEmailAddress = "demo@ch.gov.uk";
            const expectedAssociations: Associations = {
                items: [
                    {
                        id: "1234567890",
                        userId: "qwertyiop",
                        userEmail: "demo@ch.gov.uk",
                        companyNumber: "NI038379",
                        companyName: "THE POLISH BREWERY"
                    },
                    {
                        id: "2345678901",
                        userId: "qwertyiop",
                        userEmail: "demo@ch.gov.uk",
                        companyNumber: "01777777",
                        companyName: "BRITISH AIRWAYS PLC"
                    }
                ]
            } as Associations;
            // When
            const result = getUserAssociations(userEmailAddress);
            // Then
            expect(result).resolves.toEqual(expectedAssociations);
        });

        it("should return no associations for the user if there are not any", () => {
            // Given
            const userEmailAddress = "test@test.com";
            const expectedAssociations: Associations = {
                items: []
            } as Associations;
            // When
            const result = getUserAssociations(userEmailAddress);
            // Then
            expect(result).resolves.toEqual(expectedAssociations);
        });
    });
});
