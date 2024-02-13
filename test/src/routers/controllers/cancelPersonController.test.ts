import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations, emptyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { COMPANY_NAME, REFERER_URL } from "../../../../src/constants";

const router = supertest(app);
const session: Session = new Session();
const userEmail = "test@test.com";
const url = `/your-companies/cancel-person/${userEmail}`;
const enCommon = require("../../../../src/locales/en/translation/common.json");
const cyCommon = require("../../../../src/locales/cy/translation/common.json");
const en = require("../../../../src/locales/en/translation/cancel-person.json");
const cy = require("../../../../src/locales/cy/translation/cancel-person.json");

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn()
    };
});

describe("GET /your-companies/cancel-person/:userEmail", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the /your-companies/cancel-person/:userEmail page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if language version set to English", async () => {
        // Given
        const langVersion = "?lang=en";
        const expectedHeader = `${en.are_you_sure_you_want_to_cancel_start}${userEmail}${en.are_you_sure_you_want_to_cancel_end}`;
        const expectedCompanyName = "Doughnuts Limited";
        session.setExtraData(COMPANY_NAME, expectedCompanyName);
        // When
        const response = await router.get(`${url}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedHeader);
        expect(response.text).toContain(expectedCompanyName);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(enCommon.cancel);
        expect(response.text).toContain(enCommon.yes);
        expect(response.text).toContain(enCommon.no);
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        // Given
        const langVersion = "?lang=cy";
        const expectedHeader = `${cy.are_you_sure_you_want_to_cancel_start}${userEmail}${cy.are_you_sure_you_want_to_cancel_end}`;
        const expectedCompanyName = "Doughnuts Limited";
        session.setExtraData(COMPANY_NAME, expectedCompanyName);
        // When
        const response = await router.get(`${url}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedHeader);
        expect(response.text).toContain(expectedCompanyName);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cyCommon.cancel);
        expect(response.text).toContain(cyCommon.yes);
        expect(response.text).toContain(cyCommon.no);
    });
});

describe("POST /your-companies/cancel-person/:userEmail", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should return status 302 if 'yes' option selected", async () => {
        // Given
        const langVersion = "?lang=en";
        // When
        const response = await router.post(`${url}${langVersion}`).send({ cancelPerson: "yes" });
        // Then
        expect(response.statusCode).toEqual(302);
    });

    it("Should return status 302 if 'no' option selected", async () => {
        // Given
        const langVersion = "?lang=en";
        session.setExtraData(REFERER_URL, "/");
        session.setExtraData(COMPANY_NAME, "General Ltd");
        // When
        const response = await router.post(`${url}${langVersion}`).send({ cancelPerson: "no" });
        // Then
        expect(response.statusCode).toEqual(302);
    });

    it("Should return expected English error message if no option selected and language version set to English", async () => {
        // Given
        const langVersion = "?lang=en";
        const expectedErrorMessage = en.select_yes_if_you_want_to_cancel_authorisation;
        // When
        const response = await router.post(`${url}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedErrorMessage);
    });

    it("Should return expected Welsh error message if no option selected and language version set to Welsh", async () => {
        // Given
        const langVersion = "?lang=cy";
        const expectedErrorMessage = cy.select_yes_if_you_want_to_cancel_authorisation;
        // When
        const response = await router.post(`${url}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedErrorMessage);
    });
});
