import mocks from "../../../mocks/all.middleware.mock";
import { Session } from "@companieshouse/node-session-handler";
import app from "../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import { validActiveCompanyProfile } from "../../../mocks/companyProfile.mock";
import * as en from "../../../../src/locales/en/translation/confirm-company-details.json";
import * as cy from "../../../../src/locales/cy/translation/confirm-company-details.json";

const router = supertest(app);
const url = "/your-companies/confirm-company-details";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});
const badFormatCompanyProfile = {
    accounts: {
        nextAccounts: {
            periodEndOn: "2019-10-10",
            periodStartOn: "2019-01-01"
        },
        nextDue: "2020-05-31",
        overdue: false
    },
    companyName: "Test Company",
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
        addressLineTwo: "",
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

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should check session and auth before returning the your-companies page", async () => {
        session.data.extra_data.companyProfile = validActiveCompanyProfile;
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 200", async () => {
        session.data.extra_data.companyProfile = validActiveCompanyProfile;
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        session.data.extra_data.companyProfile = validActiveCompanyProfile;
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
        session.data.extra_data.companyProfile = validActiveCompanyProfile;
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
    it("should return formatted company information from get profile request", async () => {
        session.data.extra_data.companyProfile = badFormatCompanyProfile;
        const response = await router.get(`${url}`);
        const expectedCompanyStatus = "Active";
        const expectedCompanyType = "Private limited company";
        const expectedDateOfCreation = "22 June 1972";
        expect(response.text).toContain(expectedCompanyStatus);
        expect(response.text).toContain(expectedCompanyType);
        expect(response.text).toContain(expectedDateOfCreation);
    });
    it("should return formatted Welsh company information from get profile request", async () => {
        session.data.extra_data.companyProfile = badFormatCompanyProfile;
        const response = await router.get(`${url}?lang=cy`);
        const expectedCompanyStatus = "Gweithredol";
        const expectedCompanyType = "Cwmni preifat cyfyngedig";
        const expectedDateOfCreation = "22 Mehefin 1972";
        expect(response.text).toContain(expectedCompanyStatus);
        expect(response.text).toContain(expectedCompanyType);
        expect(response.text).toContain(expectedDateOfCreation);
    });
    const companyTypeTestData = [
        {
            type: "private-unlimited",
            expected: "Cwmni preifat anghyfynedig"
        },
        {
            type: "ltd",
            expected: "Cwmni preifat cyfyngedig"
        },
        {
            type: "plc",
            expected: "Cwmni cyfyngedig cyhoeddus"
        },
        {
            type: "old-public-company",
            expected: "Hen gwmni cyhoeddus"
        },
        {
            type: "limited-partnership",
            expected: "Partneriaeth gyfyngedig"
        },
        {
            type: "private-limited-guarant-nsc",
            expected: "Cwmni preifat cyfyngedig drwy warant heb gyfalaf cyfranddaliadau"
        },
        {
            type: "converted-or-closed",
            expected: "Cwmni wedi ei drosi/cau"
        },
        {
            type: "private-unlimited-nsc",
            expected: "Cwmni preifat anghyfyngedig heb gyfalaf cyfranddaliadau"
        },
        {
            type: "protected-cell-company",
            expected: "Cwmni Cell Warchodedig"
        },
        {
            type: "assurance-company",
            expected: "Cwmni aswiriant"
        },
        {
            type: "oversea-company",
            expected: "Cwmni tramor"
        }
    ];
    it.each(companyTypeTestData)("should display company types in Welsh - $type to $expected", async ({ type, expected }) => {
        session.data.extra_data.companyProfile = { ...badFormatCompanyProfile };
        session.data.extra_data.companyProfile.type = type;
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(expected);
    });
});

describe(`POST ${url}`, () => {

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
        expect(resp.header.location).toEqual("/your-companies/company/12345678/create-company-association");
    });
});
