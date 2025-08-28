import mocks from "../../../mocks/all.middleware.mock";
import { Session } from "@companieshouse/node-session-handler";
import app from "../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import { validActiveCompanyProfile } from "../../../mocks/companyProfile.mock";

const router = supertest(app);
const url = "/your-companies/confirm-company-details";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});
jest.mock("../../../../src/lib/Logger");

describe("POST /your-companies/confirm-company-details", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth", async () => {
        // Given
        session.data.extra_data.companyProfile = validActiveCompanyProfile;
        // When
        await router.post(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("redirects to create company association controller with company number param in url", async () => {
        // Given
        session.data.extra_data.companyProfile = validActiveCompanyProfile;
        // When
        const resp = await router.post(url);
        // Then
        expect(resp.status).toEqual(302);
        expect(resp.header.location).toEqual("/your-companies/company/12345678/confirmation-company-added");
    });
});
