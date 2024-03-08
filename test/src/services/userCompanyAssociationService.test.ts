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
import { Association, Associations } from "../../../src/types/associations";
import { Cancellation } from "../../../src/types/cancellation";
import { Removal } from "../../../src/types/removal";

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
                        companyName: "THE POLISH BREWERY",
                        status: "confirmed",
                        invitations:
                            [
                                {
                                    invitedBy: "123454321",
                                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                                }
                            ]
                    },
                    {
                        id: "2345678901",
                        userId: "qwertyiop",
                        userEmail: "demo@ch.gov.uk",
                        companyNumber: "01777777",
                        companyName: "BRITISH AIRWAYS PLC",
                        status: "confirmed",
                        invitations:
                            [
                                {
                                    invitedBy: "123454321",
                                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                                }
                            ]
                    },
                    {
                        id: "44345677554",
                        userId: "qwertyiop",
                        userEmail: "demo@ch.gov.uk",
                        companyNumber: "10866549",
                        companyName: "ANDROID TECHNOLOGY LTD",
                        status: "awaiting-approval",
                        invitations:
                            [
                                {
                                    invitedBy: "1122334455",
                                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                                },
                                {
                                    invitedBy: "75853993475",
                                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                                }
                            ]
                    },
                    {
                        id: "234322344",
                        userId: "qwertyiop",
                        userEmail: "demo@ch.gov.uk",
                        companyNumber: "08449801",
                        companyName: "BROWN AND SALTER LIMITED",
                        status: "awaiting-approval",
                        invitations:
                            [
                                {
                                    invitedBy: "5544332211",
                                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                                }
                            ]

                    },
                    {
                        id: "6654463562412",
                        userId: "qwertyiop",
                        userEmail: "demo@ch.gov.uk",
                        companyNumber: "18882777",
                        companyName: "FLOWERS LIMITED",
                        status: "awaiting-approval",
                        invitations:
                            [
                                {
                                    invitedBy: "76896789",
                                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                                }
                            ]

                    }
                ],
                totalResults: 5
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
                items: [],
                totalResults: 0
            } as Associations;
            // When
            const result = getUserAssociations(userEmailAddress);
            // Then
            expect(result).resolves.toEqual(expectedAssociations);
        });
    });

    describe("getCompanyAssociations", () => {
        it("should return associations for the company if there are any", async () => {
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
            const result = await getCompanyAssociations(companyNumber, undefined);
            // Then
            expect(result).toEqual(expectedCompanyAssociations);
        });

        it("should not contain cancelled association in returned associations for the company", async () => {
            // Given
            const companyNumber = "NI038379";
            const cancellation = {
                cancelPerson: "yes",
                userEmail: "eva.brown@company.com",
                companyNumber: companyNumber
            } as Cancellation;
            const cancelledCompanyAssociation = {
                id: "2345678901",
                userId: "jsldkfjsd",
                userEmail: "eva.brown@company.com",
                companyNumber: "NI038379",
                companyName: "THE POLISH BREWERY",
                status: "Awaiting confirmation"
            } as Association;
            // When
            const result = await getCompanyAssociations(companyNumber, cancellation);
            // Then
            expect(result).not.toContain(cancelledCompanyAssociation);
        });

        it("should return association for the company after removal", async () => {
            // Given
            const companyNumber = "NI038379";
            const cancellation = {
                removePerson: "confirm",
                userEmail: "john.smith@test.com",
                companyNumber: companyNumber
            } as Removal;
            const removedCompanyAssociation = {
                id: "2345678901",
                userId: "jsldkfjsd",
                userEmail: "john.smith@test.com",
                displayName: "Not provided",
                companyNumber: "NI038379",
                companyName: "THE POLISH BREWERY",
                status: "Confirmed"
            } as Association;
            // When
            const result = await getCompanyAssociations(companyNumber, cancellation);
            // Then
            expect(result).not.toContain(removedCompanyAssociation);
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
            const companyAssociations = await getCompanyAssociations(companyNumber, undefined);
            const numberOfAssociations = companyAssociations.items.length;
            await addUserEmailAssociation(userEmailAddress, companyNumber);
            const resultAfter = await getCompanyAssociations(companyNumber, undefined);
            expect(resultAfter.items.length).toEqual(numberOfAssociations);
        });
        it("should add the email if not associated", async () => {
            const userEmailAddress = "testemail@ch.gov.uk";
            const companyNumber = "NI038379";
            const companyAssociations = await getCompanyAssociations(companyNumber, undefined);
            const numberOfAssociations = companyAssociations.items.length;
            const userAuthorisedBefore = await isEmailAuthorised(userEmailAddress, companyNumber);
            await addUserEmailAssociation(userEmailAddress, companyNumber);
            const result = await getCompanyAssociations(companyNumber, undefined);
            const userAuthorised = await isEmailAuthorised(userEmailAddress, companyNumber);
            expect(userAuthorisedBefore).toBe(false);
            expect(result.items.length).toEqual(numberOfAssociations + 1);
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
