import mocks from "../../mocks/all.middleware.mock";
import { Session } from "@companieshouse/node-session-handler";

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
        expect(response.text).toContain(cy.company_name);
        expect(response.text).toContain(cy.company_number);
        expect(response.text).toContain(cy.status);
        expect(response.text).toContain(cy.incorporation_date);
        expect(response.text).toContain(cy.company_type);
        expect(response.text).toContain(cy.registered_office_address);
        expect(response.text).toContain(cy.confirm_and_continue);
        expect(response.text).toContain(cy.choose_a_different_company);
    });
    it("should return FORMATTEDD TEXT", async () => {
        const badFormatCompanyProfile = {
            accounts: {
                nextAccounts: {
                    periodEndOn: "2019-10-10",
                    periodStartOn: "2019-01-01"
                },
                nextDue: "2020-05-31",
                overdue: false
            },
            companyName: "TeST CoMpaNy",
            companyNumber: "12345678",
            companyStatus: "active",
            companyStatusDetail: "company status detail",
            confirmationStatement: {
                lastMadeUpTo: "2019-04-30",
                nextDue: "2020-04-30",
                nextMadeUpTo: "2020-03-15",
                overdue: false
            },
            dateOfCreation: "1972-06-22",
            hasBeenLiquidated: false,
            hasCharges: false,
            hasInsolvencyHistory: false,
            jurisdiction: "england-wales",
            links: {},
            registeredOfficeAddress: {
                addressLineOne: "Line1",
                addressLineTwo: "Line2",
                careOf: "careOf",
                country: "uk",
                locality: "locality",
                poBox: "123",
                postalCode: "POST CODE",
                premises: "premises",
                region: "region"
            },
            sicCodes: ["123"],
            type: "ltd"
        };
        session.data.extra_data.companyProfile = badFormatCompanyProfile;
        const response = await router.get(`${url}`);
        const expectedCompanyName = "Test Company";
        const expectedCompanyStatus = "Active";
        const expectedCompanyType = "Private limited company";
        const expectedDateOfCreation = "22 June 1972";
        expect(response.text).toContain(expectedCompanyName);
        expect(response.text).toContain(expectedCompanyStatus);
        expect(response.text).toContain(expectedCompanyType);
        expect(response.text).toContain(expectedDateOfCreation);
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

    it("redirects to transaction page with company number param in transaction url", async () => {
        const resp = await router.post(url);
        expect(resp.status).toEqual(302);
        expect(resp.header.location).toEqual("/your-companies/company/12345678/transaction");
    });
});