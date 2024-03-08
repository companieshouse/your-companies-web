import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { COMPANY_NAME, REFERER_URL } from "../../../../src/constants";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as cyCommon from "../../../../src/locales/cy/translation/common.json";
import * as en from "../../../../src/locales/en/translation/cancel-person.json";
import * as cy from "../../../../src/locales/cy/translation/cancel-person.json";

const router = supertest(app);
const session: Session = new Session();
const userEmail = "test@test.com";
const companyNumber = "012345678";
const url = `/your-companies/company/${companyNumber}/cancel-person/${userEmail}`;

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
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

describe("GET /your-companies/company/:companyNumber/cancel-person/:userEmail", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the /your-companies/company/:companyNumber/cancel-person/:userEmail page", async () => {
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

describe("POST /your-companies/company/:companyNumber/cancel-person/:userEmail", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(REFERER_URL, "/");
        session.setExtraData(COMPANY_NAME, "General Ltd");
    });

    it("should check session and auth before returning the /your-companies/company/:companyNumber/cancel-person/:userEmail page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("Should return status 302 if `yes` option selected", async () => {
        // Given
        const langVersion = "?lang=en";
        // When
        const response = await router.post(`${url}${langVersion}`).send({ cancelPerson: "yes" });
        // Then
        expect(response.statusCode).toEqual(302);
    });

    it("Should return status 302 if `no` option selected", async () => {
        // Given
        const langVersion = "?lang=en";
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
