import {
    COMPNANY_ASSOCIATED_WITH_USER,
    COMPNANY_NOT_ASSOCIATED_WITH_USER,
    USER_REMOVED_FROM_COMPANY_ASSOCIATIONS
} from "../../../src/constants";
import {
    getCompanyAssociations,
    getUserAssociations,
    isCompanyAssociatedWithUser,
    isEmailAuthorised,
    addUserEmailAssociation,
    removeUserFromCompanyAssociations
} from "../../../src/services/userCompanyAssociationService";
import { Associations } from "../../../src/types/associations";

describe("User Company Association Service", () => {
    describe("isCompanyAssociatedWithUser", () => {
        it("should return confirmation if the company is associated with the user", () => {
            // Given
            const companyNumber = "NI038379";
            const userEmailAddress = "test@test.com";
            // When
            const result = isCompanyAssociatedWithUser(
                companyNumber,
                userEmailAddress
            );
            // Then
            expect(result).resolves.toEqual(COMPNANY_ASSOCIATED_WITH_USER);
        });

        it("should return negation if the company is not associated with the user", () => {
            // Given
            const companyNumber = "NI012345";
            const userEmailAddress = "test@test.com";
            // When
            const result = isCompanyAssociatedWithUser(
                companyNumber,
                userEmailAddress
            );
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

    describe("getCompanyAssociations", () => {
        it("should return associations for the company if there are any", () => {
            // Given
            const companyNumber = "NI038379";
            const expectedCompanyAssociations = {
                items: [
                    {
                        id: "1234567890",
                        userId: "qwertyiop",
                        userEmail: "demo@ch.gov.uk",
                        companyNumber: "NI038379",
                        companyName: "THE POLISH BREWERY",
                        status: "Awaiting confirmation"
                    },
                    {
                        id: "2345678901",
                        userId: "jsldkfjsd",
                        userEmail: "john.smith@test.com",
                        displayName: "Not provided",
                        companyNumber: "NI038379",
                        companyName: "THE POLISH BREWERY",
                        status: "Confirmed"
                    },
                    {
                        id: "2345678901",
                        userId: "jsldkfjsd",
                        userEmail: "eva.brown@company.com",
                        companyNumber: "NI038379",
                        companyName: "THE POLISH BREWERY",
                        status: "Awaiting confirmation"
                    },
                    {
                        id: "2345678901",
                        userId: "jsldkfjsd",
                        userEmail: "mark.black@private.com",
                        displayName: "Mark Black",
                        companyNumber: "NI038379",
                        companyName: "THE POLISH BREWERY",
                        status: "Confirmed"
                    }
                ]
            } as Associations;
            // When
            const result = getCompanyAssociations(companyNumber, undefined);
            // Then
            expect(result).resolves.toEqual(expectedCompanyAssociations);
        });
    });
    describe("removeUserFromCompanyAssociations", () => {
        it("should remove user from company associations", () => {
            // Given
            const userEmail = "test@test.com";
            const companyNumber = "12345678";
            // When
            const result = removeUserFromCompanyAssociations(userEmail, companyNumber);
            // Then
            expect(result).resolves.toEqual(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        });
    });
    describe("isEmailAuthorised", () => {
        it("should return true is the email is associated", async () => {
            const userEmailAddress = "demo@ch.gov.uk";
            const companyNumber = "NI038379";
            const result = await isEmailAuthorised(userEmailAddress, companyNumber);
            expect(result).toEqual(true);
        });
        it("should return false is the email is not associated", async () => {
            const userEmailAddress = "demo2@ch.gov.uk";
            const companyNumber = "NI038379";
            const result = await isEmailAuthorised(userEmailAddress, companyNumber);
            expect(result).toEqual(false);
        });
    });
    describe("addUserEmailAssociation", () => {
        it("should not add the email if associated", async () => {
            const userEmailAddress = "demo@ch.gov.uk";
            const companyNumber = "NI038379";
            await addUserEmailAssociation(userEmailAddress, companyNumber);
            const resultAfter = await getCompanyAssociations(companyNumber, undefined);
            expect(resultAfter.items.length).toEqual(4);
        });
        it("should add the email if not associated", async () => {
            const userEmailAddress = "testemail@ch.gov.uk";
            const companyNumber = "NI038379";
            const userAuthorisedBefore = await isEmailAuthorised(userEmailAddress, companyNumber);
            await addUserEmailAssociation(userEmailAddress, companyNumber);
            const result = await getCompanyAssociations(companyNumber, undefined);
            const userAuthorised = await isEmailAuthorised(userEmailAddress, companyNumber);
            expect(userAuthorisedBefore).toBe(false);
            expect(result.items.length).toEqual(5);
            expect(userAuthorised).toBe(true);
        });
    });
    describe("addUserEmailAssociation", () => {
        it("should not add the email if associated", async () => {
            const userEmailAddress = "john.smith@test.com";
            const companyNumber = "01777777";
            await addUserEmailAssociation(userEmailAddress, companyNumber);
            const resultAfter = await getCompanyAssociations(companyNumber, undefined);
            expect(resultAfter.items.length).toEqual(1);
        });
        it("should add the email if not associated", async () => {
            const userEmailAddress = "testemail@ch.gov.uk";
            const companyNumber = "01777777";
            const userAuthorisedBefore = await isEmailAuthorised(userEmailAddress, companyNumber);
            await addUserEmailAssociation(userEmailAddress, companyNumber);
            const result = await getCompanyAssociations(companyNumber, undefined);
            const userAuthorised = await isEmailAuthorised(userEmailAddress, companyNumber);
            expect(userAuthorisedBefore).toBe(false);
            expect(result.items.length).toEqual(2);
            expect(userAuthorised).toBe(true);
        });
    });
});
