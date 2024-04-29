import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as associationsService from "../../../../src/services/associationsService";
import * as constants from "../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../src/locales/en/translation/add-presenter-check-details.json";
import * as cy from "../../../../src/locales/cy/translation/add-presenter-check-details.json";

jest.mock("../../../../src/services/companyProfileService");
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

const mockCreateAssociation = jest.spyOn(associationsService, "createAssociation");

const router = supertest(app);
const url = "/your-companies/add-presenter-check-details/12345678";

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.COMPANY_NUMBER, "NI038379");
        session.setExtraData(constants.COMPANY_NAME, "Test Company");
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
        session.setExtraData(constants.COMPANY_NUMBER, "NI038379");
        session.setExtraData(constants.COMPANY_NAME, "Test Company");
    });

    it("should check session, company and user auth before routing to controller", async () => {
        await router.post(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect to the manage authorised person added success page", async () => {
        // Given
        const email = "bruce@bruce.com";
        session.data.extra_data.authorisedPersonEmail = email;
        const associationId = "012345678";
        mockCreateAssociation.mockResolvedValue(associationId);
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toContain(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
            `:${constants.COMPANY_NUMBER}`, "NI038379"
        ));
    });
});
