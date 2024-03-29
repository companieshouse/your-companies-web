import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { getCompanyProfile } from "../../../../src/services/companyProfileService";
import { addUserEmailAssociation } from "../../../../src/services/userCompanyAssociationService";
import { validActiveCompanyProfile } from "../../../mocks/companyProfile.mock";
import * as constants from "../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../src/locales/en/translation/add-presenter-check-details.json";
import * as cy from "../../../../src/locales/cy/translation/add-presenter-check-details.json";

jest.mock("../../../../src/services/companyProfileService");
jest.mock("../../../../src/services/userCompanyAssociationService");
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

const mockGetCompanyProfile = getCompanyProfile as jest.Mock;
const mockAddUserEmailAssociation = addUserEmailAssociation as jest.Mock;

const router = supertest(app);
const url = "/your-companies/add-presenter-check-details/12345678";

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetCompanyProfile.mockResolvedValueOnce(validActiveCompanyProfile);
    });
    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.email_address);
        expect(response.text).toContain(en.change);
        expect(response.text).toContain(en.confirm_and_send_email);
        expect(response.text).toContain(en.change);
    });
    it("should return expected Welsh content if Welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.email_address);
        expect(response.text).toContain(cy.change);
        expect(response.text).toContain(cy.confirm_and_send_email);
        expect(response.text).toContain(cy.change);
    });
});

describe(`POST ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetCompanyProfile.mockResolvedValueOnce({ ...validActiveCompanyProfile, companyNumber: "NI038379" });
    });

    it("should check session, company and user auth before routing to controller", async () => {
        await router.post(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should call addUserEmailAssociation with correct data", async () => {
        const companyNumber = "NI038379";
        const email = "bruce@bruce.com";
        session.data.extra_data.authorisedPersonEmail = email;
        await router.post(url);
        expect(mockAddUserEmailAssociation).toHaveBeenCalledWith(email, companyNumber);
    });
    it("should redirect to the manage authorised person added success page", async () => {
        const response = await router.post(url);
        expect(response.status).toEqual(302);
        expect(response.header.location).toContain(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
            `:${constants.COMPANY_NUMBER}`, "NI038379"
        ));
    });
});
