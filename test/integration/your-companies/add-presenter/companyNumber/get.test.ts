import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import en from "../../../../../locales/en/add-presenter.json";
import cy from "../../../../../locales/cy/add-presenter.json";
import * as constants from "../../../../../src/constants";
import { setExtraData } from "../../../../../src/lib/utils/sessionUtils";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../../src/services/companyProfileService");

const router = supertest(app);
const url = "/your-companies/add-presenter/12345678";
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.headers = { referrer: "testUrl.com/confirmation-person-removed" };
    req.session = session;
    next();
});

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

describe("GET /your-companies/add-presenter/companyNumber", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.COMPANY_NUMBER, "12345678");
        session.setExtraData(constants.COMPANY_NAME, "Test Company");
    });

    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        // Given
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "English", langVersion: undefined, lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return status 200 and expected $langInfo content if lang set to '$langVersion'",
        async ({ langVersion, lang }) => {
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.tell_us_the_email);
            expect(response.text).toContain(lang.you_can_change_who);
            expect(response.text).toContain(lang.email_address);
        });

    it("should validate and display invalid input and error if input stored in session", async () => {
        // Given
        const expectedInput = "bad email";
        session.setExtraData("proposedEmail", expectedInput);
        // When
        const response = await router.get(`${url}?lang=en`);
        // Then
        expect(response.text).toContain(expectedInput);
        expect(response.text).toContain("Enter an email address in the correct format");
    });

    it("should not display input cf is true", async () => {
        // Given
        const expectedInput = "bad email";
        session.setExtraData("proposedEmail", expectedInput);
        // When
        const response = await router.get(`${url}?lang=en&cf=true`);
        // Then
        expect(response.text).not.toContain(expectedInput);
        expect(response.text).not.toContain("Enter an email address in the correct format");
    });

    test.each([
        { condition: "is without confirmation ending", referrer: "testUrl.com" },
        { condition: "contains confirmation-person-removed", referrer: "testUrl.com/confirmation-person-removed" },
        { condition: "referrer contains confirmation-person-added", referrer: "testUrl.com/confirmation-person-added" },
        { condition: "referrer contains confirmation-cancel-person", referrer: "testUrl.com/confirmation-cancel-person" }
    ])("should not redirect, and return status 200 if referrer $condition",
        async ({ referrer }) => {
            // Given
            mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
                req.headers = { referrer };
                req.session = session;
                next();
            });
            const hrefAValue = "testUrl.com";
            setExtraData(session, constants.REFERER_URL, hrefAValue);
            // When
            const response = await router.get(url);
            // Then
            expect(response.status).toEqual(200);
        });

    it("should return status 302 and correct response message including desired url path on page redirect", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        mocks.mockNavigationMiddleware.mockImplementation((req: Request, res: Response) => {
            res.redirect(urlPath);
        });
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
