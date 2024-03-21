import {
    getCompanyAssociations,
    isEmailAuthorised
} from "../../../src/services/userCompanyAssociationService";
import { Association, Associations } from "../../../src/types/associations";
import { Cancellation } from "../../../src/types/cancellation";
import { Removal } from "../../../src/types/removal";

describe("User Company Association Service", () => {

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
                        status: "awaiting-approval"
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
                        status: "awaiting-approval"
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
                status: "awaiting-approval"
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

    describe("isEmailAuthorised", () => {
        it("should return true is the email is associated", async () => {
            const userEmailAddress = "mark.black@private.com";
            const companyNumber = "NI038379";
            const result = await isEmailAuthorised(userEmailAddress, companyNumber);
            expect(result).toBeTruthy();
        });

        it("should return false is the email is not associated", async () => {
            const userEmailAddress = "demo2@ch.gov.uk";
            const companyNumber = "NI038379";
            const result = await isEmailAuthorised(userEmailAddress, companyNumber);
            expect(result).toBeFalsy();
        });
    });
});
