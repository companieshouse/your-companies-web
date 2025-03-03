import mocks from "../../../../../../mocks/all.middleware.mock";
import app from "../../../../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as constants from "../../../../../../../src/constants";
import * as enCommon from "../../../../../../../locales/en/common.json";
import * as cyCommon from "../../../../../../../locales/cy/common.json";
import * as en from "../../../../../../../locales/en/cancel-person.json";
import * as cy from "../../../../../../../locales/cy/cancel-person.json";
import * as referrerUtils from "../../../../../../../src/lib/utils/referrerUtils";
import { setExtraData } from "../../../../../../../src/lib/utils/sessionUtils";
const router = supertest(app);
const session: Session = new Session();
const userEmail = "test@test.com";
const companyNumber = "012345678";
const url = `/your-companies/company/${companyNumber}/cancel-person/${userEmail}`;

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../../../../src/lib/Logger");
jest.mock("../../../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

describe("GET /your-companies/company/:companyNumber/cancel-person/:userEmail", () => {

    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    redirectPageSpy.mockReturnValue(false);

    it("should check session and auth before returning the /your-companies/company/:companyNumber/cancel-person/:userEmail page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            lang: enCommon,
            expectedHeader: `${en.are_you_sure_you_want_to_cancel_start}${userEmail}${en.are_you_sure_you_want_to_cancel_end}`,
            expectedCompanyName: "Doughnuts Limited"
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cyCommon,
            expectedHeader: `${cy.are_you_sure_you_want_to_cancel_start}${userEmail}${cy.are_you_sure_you_want_to_cancel_end}`,
            expectedCompanyName: "Doughnuts Limited"
        }
    ])("should return expected $langInfo content if language version set to '$langVersion'",
        async ({ langVersion, lang, expectedHeader, expectedCompanyName }) => {
            // Given
            session.setExtraData(constants.COMPANY_NAME, expectedCompanyName);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(expectedHeader);
            expect(response.text).toContain(expectedCompanyName);
            expect(response.text).toContain(lang.continue);
            expect(response.text).toContain(lang.cancel);
            expect(response.text).toContain(lang.yes);
            expect(response.text).toContain(lang.no);
        });

    it("should not redirect, and return status 200 if referrer is without confirmation ending", async () => {

        // Given
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: "testUrl.com" };
            req.session = session;
            next();
        });

        const hrefAValue = "testUrl.com";
        setExtraData(session, constants.REFERER_URL, hrefAValue);

        // When Then
        await router.get(url).expect(200);

    });

    it("should not redirect, and return status 200 if referrer contains confirmation-person-removed", async () => {

        // Given
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: "testUrl.com/confirmation-person-removed" };
            req.session = session;
            next();
        });

        const hrefAValue = "testUrl.com";
        setExtraData(session, constants.REFERER_URL, hrefAValue);

        // When Then
        const response = await router.get(url);
        expect(response.status).toEqual(200);

    });

    it("should not redirect, and return status 200 if referrer contains confirmation-person-added", async () => {

        // Given
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: "testUrl.com/confirmation-person-added" };
            req.session = session;
            next();
        });

        const hrefAValue = "testUrl.com";
        setExtraData(session, constants.REFERER_URL, hrefAValue);

        // When Then
        await router.get(url).expect(200);

    });

    it("should not redirect, and return status 200 if referrer contains confirmation-cancel-person", async () => {

        // Given
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: "testUrl.com/confirmation-cancel-person" };
            req.session = session;
            next();
        });

        const hrefAValue = "testUrl.com";
        setExtraData(session, constants.REFERER_URL, hrefAValue);

        // When Then
        await router.get(url).expect(200);

    });

    it("should not redirect, and return status 200 if referrer contains manage-authorised-people", async () => {

        // Given
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: "testUrl.com/manage-authorised-people" };
            req.session = session;
            next();
        });
        const pageIndicator = true;
        setExtraData(session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, pageIndicator);

        const hrefAValue = "testUrl.com";
        setExtraData(session, constants.REFERER_URL, hrefAValue);

        // When Then
        const response = await router.get(url);
        expect(response.status).toEqual(200);

    });

    it("should not redirect, and return status 200 if companyNumber equals pageIndicator and userEmail is included in userEmailsArray", async () => {
        // Given
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: undefined };
            req.session = session;
            next();
        });
        const userEmail = "test@test.com";
        const pageIndicator = "012345678";
        const userEmailsArray = ["firstEmail@test.com", "test@test.com"];

        setExtraData(session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, pageIndicator);
        setExtraData(session, constants.USER_EMAIL, userEmail);
        setExtraData(session, constants.USER_EMAILS_ARRAY, userEmailsArray);
        // When
        const response = await router.get(url);

        // Then
        expect(response.status).toEqual(200);
    });

    it("should redirect, and return status 302 if companyNumber equals pageIndicator but userEmail is not included in userEmailsArray", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: undefined };
            req.session = session;
            next();
        });
        const userEmail = "test@test.com";
        const pageIndicator = "012345678";
        const userEmailsArray = ["firstEmail@test.com"];

        setExtraData(session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, pageIndicator);
        setExtraData(session, constants.USER_EMAIL, userEmail);
        setExtraData(session, constants.USER_EMAILS_ARRAY, userEmailsArray);
        // When
        const response = await router.get(url);

        // Then
        expect(response.status).toEqual(302);
    });

    it("should redirect, and return status 302 if companyNumber does not equal pageIndicator", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: undefined };
            req.session = session;
            next();
        });
        const userEmail = "test@test.com";
        const pageIndicator = "555555";
        const userEmailsArray = ["firstEmail@test.com"];

        setExtraData(session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, pageIndicator);
        setExtraData(session, constants.USER_EMAIL, userEmail);
        setExtraData(session, constants.USER_EMAILS_ARRAY, userEmailsArray);
        // When
        const response = await router.get(url);

        // Then
        expect(response.status).toEqual(302);
    });

    it("should redirect, and return status 302 if referrer is undefined and pageIndicator is true", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: undefined };
            req.session = session;
            next();
        });
        const pageIndicator = true;
        setExtraData(session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, pageIndicator);

        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
    });

    it("should return status 302 on page redirect", async () => {
        redirectPageSpy.mockReturnValue(true);
        const response = await router.get(url);
        expect(response.status).toEqual(302);
    });

    it("should return correct response message including desired url path", async () => {
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        const response = await router.get(url);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

});
