import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../locales/en/confirmation-company-removed.json";
import * as cy from "../../../../locales/cy/confirmation-company-removed.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as constants from "../../../../src/constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../../../src/lib/utils/sessionUtils";

const router = supertest(app);
const url = `/your-companies/confirmation-company-removed`;
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        deleteExtraData(session, constants.LAST_REMOVED_COMPANY_NAME);
        deleteExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER);
    });

    it("should check session and auth before returning the remove company confirmed page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    describe.each([
        { language: "en", companyName: "Acme Ltd", companyNumber: "NI038379", successMessage: enCommon.success, removedMessage: en.you_have_removed },
        { language: "cy", companyName: "Cwmni Cymraeg", companyNumber: "WA123456", successMessage: cyCommon.success, removedMessage: cy.you_have_removed }
    ])("with $language language", ({ language, companyName, companyNumber, successMessage, removedMessage }) => {
        it(`should return expected ${language} content`, async () => {
            setExtraData(session, constants.LAST_REMOVED_COMPANY_NAME, companyName);
            setExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER, companyNumber);

            const response = await router.get(`${url}${language === "cy" ? "?lang=cy" : ""}`);

            expect(response.status).toBe(200);
            expect(response.text).toContain(successMessage);
            expect(response.text).toContain(removedMessage);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);

            expect(getExtraData(session, constants.LAST_REMOVED_COMPANY_NAME)).toBeUndefined();
            expect(getExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER)).toBeUndefined();
        });
    });

    it("should clear company data from session after rendering", async () => {
        const companyName = "Test Company";
        const companyNumber = "TC123456";

        setExtraData(session, constants.LAST_REMOVED_COMPANY_NAME, companyName);
        setExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER, companyNumber);

        await router.get(url);

        expect(getExtraData(session, constants.LAST_REMOVED_COMPANY_NAME)).toBeUndefined();
        expect(getExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER)).toBeUndefined();
    });

    describe.each([
        { scenario: "missing company name", name: undefined, number: "12345678" },
        { scenario: "missing company number", name: "Missing Number Ltd", number: undefined },
        { scenario: "both company name and number missing", name: undefined, number: undefined }
    ])("Bad day scenario: $scenario", ({ name, number }) => {
        it("should return 200 OK with an error message", async () => {
            if (name !== undefined) setExtraData(session, constants.LAST_REMOVED_COMPANY_NAME, name);
            if (number !== undefined) setExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER, number);

            const response = await router.get(url + "?lang=en");

            expect(response.status).toBe(200);
            expect(response.text).toContain("Sorry, there is a problem with the service");
            expect(response.text).toContain("Try again later");
            expect(response.text).toContain("Contact Companies House");
        });
    });

    describe.each([
        { scenario: "empty string company name", name: "", number: "12345678" },
        { scenario: "empty string company number", name: "Empty Number Ltd", number: "" }
    ])("Edge case: $scenario", ({ name, number }) => {
        it("should handle the request without error", async () => {
            setExtraData(session, constants.LAST_REMOVED_COMPANY_NAME, name);
            setExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER, number);

            const response = await router.get(url);

            expect(response.status).toBe(200);
            if (name) expect(response.text).toContain(name);
            if (number) expect(response.text).toContain(number);
            expect(response.text).not.toContain("you_have_removed");
        });
    });

    describe.each([
        { scenario: "extremely long company name", name: "A".repeat(1000), number: "12345678" },
        { scenario: "special characters in company name", name: "Special & Co. (£€$) Ltd.", number: "12345678" },
        { scenario: "non-standard company number format", name: "Non-Standard Ltd", number: "AB-123/456" }
    ])("Edge case: $scenario", ({ name, number }) => {
        it("should handle the request correctly", async () => {
            setExtraData(session, constants.LAST_REMOVED_COMPANY_NAME, name);
            setExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER, number);

            const response = await router.get(url);

            expect(response.status).toBe(200);
            expect(response.text).toContain(name);
            expect(response.text).toContain(number);
        });
    });
});
