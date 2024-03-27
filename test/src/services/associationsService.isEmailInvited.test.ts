import * as associationsService from "../../../src/services/associationsService";
import { companyAssociations } from "../../mocks/associations.mock";
import { Request } from "express";
jest.mock("../../../src/services/apiClientService");

const reqest = {} as Request;
const companyNumber = "NI038379";

describe("associationsService", () => {
    describe("isEmailInvited", () => {
        const mockGetCompanyAssociations = jest.spyOn(associationsService, "getCompanyAssociations");
        mockGetCompanyAssociations.mockResolvedValue(companyAssociations);

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return true response if email is invited", async () => {
            // Given
            const email = "eva.brown@company.com";
            // When
            const result = await associationsService.isEmailInvited(reqest, email, companyNumber);
            // Then
            expect(result).toBeTruthy();
        });

        it("should return false response if email is not invited", async () => {
            // Given
            const email = "eva.smith@test.org";
            // When
            const result = await associationsService.isEmailInvited(reqest, email, companyNumber);
            // Then
            expect(result).toBeFalsy();
        });
    });
});
