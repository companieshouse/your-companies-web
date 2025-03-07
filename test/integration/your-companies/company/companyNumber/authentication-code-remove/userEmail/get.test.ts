import mocks from "../../../../../../mocks/all.middleware.mock";
import app from "../../../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../../../../locales/en/remove-authorised-person.json";
import * as cy from "../../../../../../../locales/cy/remove-authorised-person.json";
import * as enCommon from "../../../../../../../locales/en/common.json";
import * as cyCommon from "../../../../../../../locales/cy/common.json";
import * as referrerUtils from "../../../../../../../src/lib/utils/referrerUtils";
import { setExtraData } from "../../../../../../../src/lib/utils/sessionUtils";

const router = supertest(app);

const session: Session = new Session();
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

const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

describe("GET /your-companies/company/:companyNumber/authentication-code-remove/:userEmail", () => {
    const userEmail = "test@test.com";
    const companyNumber = "123456";
    const companyName = "Doughnuts Limited";
    const userName = "John Black";
    const urlWithEmail = `/your-companies/company/${companyNumber}/authentication-code-remove/${userEmail}`;
    const urlWithName = `/your-companies/company/${companyNumber}/authentication-code-remove/${userEmail}?userName=${userName}`;

    beforeEach(() => {
        jest.clearAllMocks;
        redirectPageSpy.mockReturnValue(false);
    });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            pathInfo: "authentication-code-remove/:userEmail",
            includedText: userEmail,
            excludedText: userName,
            url: urlWithEmail
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            pathInfo: "authentication-code-remove/:userEmail",
            includedText: userEmail,
            excludedText: userName,
            url: urlWithEmail
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            pathInfo: "authentication-code-remove/:userEmail?userName=:userName",
            includedText: userName,
            excludedText: undefined,
            url: urlWithName
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            pathInfo: "authentication-code-remove/:userEmail?userName=:userName",
            includedText: userName,
            excludedText: undefined,
            url: urlWithName
        }
    ])("should check session and auth and return status 200 and expected $langInfo content if language version set to '$langVersion' for $pathInfo page",
        async ({ langVersion, lang, langCommon, includedText, excludedText, url }) => {
            // Given
            session.setExtraData(constants.COMPANY_NAME, companyName);
            // When
            const langString = url === urlWithName ? "&lang=" : "?lang=";
            const response = await router.get(`${url}${langString}${langVersion}`);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(response.status).toEqual(200);
            expect(response.text).toContain(`${lang.remove}${includedText}`);
            expect(response.text).toContain(lang.authorisation_to_file_online);
            expect(response.text).toContain(`${lang.if_you_remove}${includedText}`);
            expect(response.text).toContain(`${lang.digital_authorisation_this_means_they}${companyName}`);
            expect(response.text).toContain(`${includedText}${lang.will_still_be_able_to_file}`);
            expect(response.text).toContain(`${lang.if}${includedText}`);
            expect(response.text).toContain(lang.is_appointed_as_an_officer);
            expect(response.text).toContain(lang.i_confirm_that_i_have_read);
            expect(response.text).toContain(lang.remove_authorisation);
            expect(response.text).toContain(langCommon.cancel);
            if (url === urlWithEmail) {
                expect(response.text).toContain(lang.without_a_current_auth_code);
                expect(response.text).toContain(`${includedText}${lang.to_let_them_know_you_have_removed}`);
                expect(response.text).toContain(lang.you_may_wish_to_change_the_auth_code);
                expect(response.text).toContain(`${includedText}${lang.digital_authorisation}`);
                expect(response.text).not.toContain(excludedText);
            } else {
                expect(response.text).toContain(`${lang.without_a_current_auth_code}${includedText}`);
                expect(response.text).toContain(lang.to_let_them_know_you_have_removed);
                expect(response.text).toContain(`${lang.you_may_wish_to_change_the_auth_code}${includedText}`);
                expect(response.text).toContain(lang.digital_authorisation);
            }

        });

    test.each([
        { condition: "referrer is without confirmation ending", referrer: "testUrl.com" },
        { condition: "rreferrer contains confirmation-person-removed", referrer: "testUrl.com/confirmation-person-removed" },
        { condition: "rreferrer contains confirmation-person-added", referrer: "testUrl.com/confirmation-person-added" },
        { condition: "rreferrer contains confirmation-cancel-person", referrer: "testUrl.com/confirmation-cancel-person" },
        { condition: "rreferrer contains manage-authorised-people", referrer: "testUrl.com/manage-authorised-people" }
    ])("should not redirect, and return status 200 if $condition",
        async ({ referrer }) => {
            // Given
            mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
                req.headers = { referrer };
                req.session = session;
                next();
            });
            const hrefAValue = "testUrl.com";
            setExtraData(session, constants.REFERER_URL, hrefAValue);
            // When Then
            const response = await router.get(urlWithEmail);
            // Then
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
        const pageIndicator = "123456";
        const userEmailsArray = ["firstEmail@test.com", "test@test.com"];

        setExtraData(session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, pageIndicator);
        setExtraData(session, constants.USER_EMAIL, userEmail);
        setExtraData(session, constants.USER_EMAILS_ARRAY, userEmailsArray);
        // When
        const response = await router.get(urlWithEmail);
        // Then
        expect(response.status).toEqual(200);
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
        const response = await router.get(urlWithEmail);
        // Then
        expect(response.status).toEqual(302);
    });

    test.each([
        {
            condition: "companyNumber equals pageIndicator but userEmail is not included in userEmailsArray",
            pageIndicator: "123456",
            userEmailsArray: ["firstEmail@test.com"]
        },
        {
            condition: "companyNumber does not equal pageIndicator",
            pageIndicator: "555555",
            userEmailsArray: ["test@test.com"]
        }
    ])("should redirect, and return status 302 if $condition",
        async ({ pageIndicator, userEmailsArray }) => {
            // Given
            redirectPageSpy.mockReturnValue(true);
            mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
                req.headers = { referrer: undefined };
                req.session = session;
                next();
            });
            const userEmail = "test@test.com";

            setExtraData(session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, pageIndicator);
            setExtraData(session, constants.USER_EMAIL, userEmail);
            setExtraData(session, constants.USER_EMAILS_ARRAY, userEmailsArray);
            // When
            const response = await router.get(urlWithEmail);
            // Then
            expect(response.status).toEqual(302);
        });

    test.each([
        { pathInfo: "authentication-code-remove/:userEmail", url: urlWithEmail },
        { pathInfo: "authentication-code-remove/:userEmail?userName=:userName", url: urlWithName }
    ])("should return status 302 and correct response message including desired url path for $pathInfo page",
        async ({ url }) => {
            // Given
            redirectPageSpy.mockReturnValue(true);
            // When
            const response = await router.get(url);
            // Then
            expect(response.status).toEqual(302);
            expect(response.text).toEqual(`Found. Redirecting to ${constants.LANDING_URL}`);
        });
});
