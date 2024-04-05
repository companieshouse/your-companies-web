/* eslint-disable import/first */
import mocks from "../../../mocks/all.middleware.mock";
import * as constants from "../../../../src/constants";
import app from "../../../../src/app";
import supertest from "supertest";
import * as urlUtils from "../../../../src/lib/utils/urlUtils";
import * as associationsService from "../../../../src/services/associationsService";

const router = supertest(app);
const companyNumber = "12345678";
const url = urlUtils.getUrlWithCompanyNumber(constants.CREATE_COMPANY_ASSOCIATION_PATH_FULL, companyNumber);
const PAGE_HEADING = "Found. Redirecting to /your-companies/confirmation-company-added";

const mockCreateCompanyAssociation: jest.SpyInstance = jest.spyOn(associationsService, "createAssociation");

describe("create company association controller tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, auth and company authorisation before creating association", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce("0123456789");
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockCreateCompanyAssociation).toHaveBeenCalled();

    });

    it("should redirect to success page after creating company assocation", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce("0123456789");
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toBe(302);
        expect(response.text).toContain(PAGE_HEADING);
    });

    it("should return 500 when Accounts Association fails", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce(undefined);
        // When
        const response = await router.get(url);
        // Then
        expect(mockCreateCompanyAssociation).toHaveBeenCalled();
        expect(response.text).toContain("Status code: 500");
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
