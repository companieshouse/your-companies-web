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
import { deleteExtraData, setExtraData } from "../../../../src/lib/utils/sessionUtils";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";

const router = supertest(app);
const url = `/your-companies/confirmation-company-removed`;
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

describe(`GET ${url}`, () => {
    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
    beforeEach(() => {
        jest.clearAllMocks();
        deleteExtraData(session, constants.LAST_REMOVED_COMPANY_NAME);
        deleteExtraData(session, constants.LAST_REMOVED_COMPANY_NUMBER);
    });
    redirectPageSpy.mockReturnValue(false);

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

    it("should return correct response message to /your-companies for confirmation-company-removed page redirection", async () => {
        redirectPageSpy.mockReturnValue(true);

        const urlPath = constants.LANDING_URL;
        const response = await router.get(url);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
