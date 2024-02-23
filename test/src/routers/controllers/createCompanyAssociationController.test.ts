/* eslint-disable import/first */

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/services/companyAssociationService");

import mocks from "../../../mocks/all.middleware.mock";
import * as constants from "../../../../src/constants";
import app from "../../../../src/app";
import supertest from "supertest";
import * as urlUtils from "../../../../src/lib/utils/urlUtils";
import { createCompanyAssociation } from "../../../../src/services/companyAssociationService";

const router = supertest(app);
const companyNumber = "12345678";
const url = urlUtils.getUrlWithCompanyNumber(constants.CREATE_COMPANY_ASSOCIATION_PATH_FULL, companyNumber);
const PAGE_HEADING = "Found. Redirecting to /your-companies/confirmation-company-added";

const mockCreateCompanyAssociation = createCompanyAssociation as jest.Mock;

describe("create company association controller tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should check session, auth and company authorisation before creating association", async () => {
        mockCreateCompanyAssociation.mockResolvedValueOnce({
            httpStatusCode: 201,
            resource: {
                id: "87654321"
            }
        });
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockCreateCompanyAssociation).toHaveBeenCalled();

    });
    it("should redirect to success page after creating company assocation", async () => {
        mockCreateCompanyAssociation.mockResolvedValueOnce({
            httpStatusCode: 201,
            resource: {
                id: "87654321"
            }
        });
        const response = await router.get(url);
        expect(response.status).toBe(302);
        expect(response.text).toContain(PAGE_HEADING);
    });

    it("should return 500 when Accounts Association fails", async () => {
        mockCreateCompanyAssociation.mockResolvedValueOnce({
            httpStatusCode: 400
        });
        const response = await router.get(url);
        expect(mockCreateCompanyAssociation).toHaveBeenCalled();
        expect(response.text).toContain("Status code: 500");
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
