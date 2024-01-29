import mocks from "../../mocks/all.middleware.mock";
import { Session } from "@companieshouse/node-session-handler";

import * as constants from "../../../src/constants";
import app from "../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";

import { validActiveCompanyProfile } from "../../mocks/companyProfileMock";
const router = supertest(app);
const en = require("../../../src/locales/en/translation/confirm-company-details.json");
const cy = require("../../../src/locales/cy/translation/confirm-company-details.json");
const url = "/your-companies/confirm-company-details";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    req.session.data.extra_data.companyProfile = validActiveCompanyProfile;
    return next();
});
describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should check session and auth before returning the your-companies page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.confirm_this_is_the_correct_company);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.status);
        expect(response.text).toContain(en.incorporation_date);
        expect(response.text).toContain(en.company_type);
        expect(response.text).toContain(en.registered_office_address);
        expect(response.text).toContain(en.confirm_and_continue);
        expect(response.text).toContain(en.choose_a_different_company);
    });

    it("should return expected Welsh content when welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.confirm_this_is_the_correct_company);
        expect(response.text).toContain(cy.company_name);
        expect(response.text).toContain(cy.company_number);
        expect(response.text).toContain(cy.status);
        expect(response.text).toContain(cy.incorporation_date);
        expect(response.text).toContain(cy.company_type);
        expect(response.text).toContain(cy.registered_office_address);
        expect(response.text).toContain(cy.confirm_and_continue);
        expect(response.text).toContain(cy.choose_a_different_company);
    });
});

describe(`POST ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth", async () => {
        await router.post(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("saves the company number to session and redirects to success page ", async () => {
        const resp = await router.post(url);
        expect(resp.status).toEqual(302);
        expect(resp.header.location).toEqual(constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL);
        expect(session.getExtraData("companyNumber")).toEqual("12345678");
    });
});
