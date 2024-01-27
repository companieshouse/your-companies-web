import { COMPNANY_ASSOCIATED_WITH_USER, COMPNANY_NOT_ASSOCIATED_WITH_USER } from "../../../src/constants";
import { isCompanyAssociatedWithUser } from "../../../src/services/userCompanyAssociationService";

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
});
