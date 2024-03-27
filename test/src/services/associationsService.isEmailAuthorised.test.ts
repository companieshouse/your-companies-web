import * as associationsService from "../../../src/services/associationsService";
import { companyAssociations } from "../../mocks/associations.mock";
import { Request } from "express";
jest.mock("../../../src/services/apiClientService");

const reqest = {} as Request;
const companyNumber = "NI038379";

describe("associationsService", () => {
    describe("isEmailAuthorised", () => {
        const mockGetCompanyAssociations = jest.spyOn(associationsService, "getCompanyAssociations");
        mockGetCompanyAssociations.mockResolvedValue(companyAssociations);

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return true response if email is authorised", async () => {
            // Given
            const email = "john.smith@test.com";
            // When
            const result = await associationsService.isEmailAuthorised(reqest, email, companyNumber);
            // Then
            expect(result).toBeTruthy();
        });

        it("should return false response if email is not authorised", async () => {
            // Given
            const email = "eva.smith@test.org";
            // When
            const result = await associationsService.isEmailAuthorised(reqest, email, companyNumber);
            // Then
            expect(result).toBeFalsy();
        });
    });
});
