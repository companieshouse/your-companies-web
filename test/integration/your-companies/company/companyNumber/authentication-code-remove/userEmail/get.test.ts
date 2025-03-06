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

    it("should check session and auth before returning the /your-companies/authentication-code-remove/:userEmail page", async () => {
        await router.get(urlWithEmail);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 for authentication-code-remove/:userEmail page", async () => {
        await router.get(urlWithEmail).expect(200);
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
            excludedText: userEmail,
            url: urlWithName
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            pathInfo: "authentication-code-remove/:userEmail?userName=:userName",
            includedText: userName,
            excludedText: userEmail,
            url: urlWithName
        }
    ])("should return expected $langInfo content if language version set to '$langVersion' for $pathInfo page",
        async ({ langVersion, lang, langCommon, includedText, excludedText, url }) => {
            // Given
            session.setExtraData(constants.COMPANY_NAME, companyName);
            // When
            const langString = url === urlWithName ? "&lang=" : "?lang=";
            const response = await router.get(`${url}${langString}${langVersion}`);
            // Then
            if (url === urlWithEmail) {
                expect(response.text).toContain(`${lang.remove}${includedText}`);
                expect(response.text).toContain(lang.authorisation_to_file_online);
                expect(response.text).toContain(`${lang.if_you_remove}${includedText}`);
                expect(response.text).toContain(`${lang.digital_authorisation_this_means_they}${companyName}`);
                expect(response.text).toContain(lang.without_a_current_auth_code);
                expect(response.text).toContain(`${includedText}${lang.to_let_them_know_you_have_removed}`);
                expect(response.text).toContain(`${includedText}${lang.will_still_be_able_to_file}`);
                expect(response.text).toContain(lang.you_may_wish_to_change_the_auth_code);
                expect(response.text).toContain(`${includedText}${lang.digital_authorisation}`);
                expect(response.text).toContain(`${lang.if}${includedText}`);
                expect(response.text).toContain(lang.is_appointed_as_an_officer);
                expect(response.text).toContain(lang.i_confirm_that_i_have_read);
                expect(response.text).toContain(lang.remove_authorisation);
                expect(response.text).toContain(langCommon.cancel);
                expect(response.text).not.toContain(excludedText);
            } else {
                expect(response.text).toContain(`${lang.remove}${includedText}`);
                expect(response.text).toContain(lang.authorisation_to_file_online);
                expect(response.text).toContain(`${lang.if_you_remove}${includedText}`);
                expect(response.text).toContain(`${lang.digital_authorisation_this_means_they}${companyName}`);
                expect(response.text).toContain(`${lang.without_a_current_auth_code}${includedText}`);
                expect(response.text).toContain(lang.to_let_them_know_you_have_removed);
                expect(response.text).toContain(`${includedText}${lang.will_still_be_able_to_file}`);
                expect(response.text).toContain(`${lang.you_may_wish_to_change_the_auth_code}${includedText}`);
                expect(response.text).toContain(lang.digital_authorisation);
                expect(response.text).toContain(`${lang.if}${includedText}`);
                expect(response.text).toContain(lang.is_appointed_as_an_officer);
                expect(response.text).toContain(lang.i_confirm_that_i_have_read);
                expect(response.text).toContain(lang.remove_authorisation);
                expect(response.text).toContain(langCommon.cancel);
            }

        });

    it("should return expected Welsh content if language version set to Welsh for authentication-code-remove/:userEmail page", async () => {
        // Given
        const langVersion = "?lang=cy";
        const expectedCompanyName = "Doughnuts Limited";
        session.setExtraData(constants.COMPANY_NAME, expectedCompanyName);

        // When
        const response = await router.get(`${urlWithEmail}${langVersion}`);
        // Then
        expect(response.text).toContain(`${cy.remove}${userEmail}`);
        expect(response.text).toContain(cy.authorisation_to_file_online);
        expect(response.text).toContain(`${cy.if_you_remove}${userEmail}`);
        expect(response.text).toContain(`${cy.digital_authorisation_this_means_they}${expectedCompanyName}`);
        expect(response.text).toContain(cy.without_a_current_auth_code);
        expect(response.text).toContain(`${userEmail}${cy.to_let_them_know_you_have_removed}`);
        expect(response.text).toContain(`${cy.remove_person_summary_start}${userEmail}`);
        expect(response.text).toContain(`${userEmail}${cy.will_still_be_able_to_file}`);
        expect(response.text).toContain(`${cy.you_may_wish_to_change_the_auth_code}${userEmail}`);
        expect(response.text).toContain(`${cy.if}${userEmail}`);
        expect(response.text).toContain(cy.is_appointed_as_an_officer);
        expect(response.text).toContain(cy.i_confirm_that_i_have_read);
        expect(response.text).toContain(cy.remove_authorisation);
        expect(response.text).toContain(cyCommon.cancel);
        expect(response.text).not.toContain(userName);
    });

    it("should check session and auth before returning the /your-companies/authentication-code-remove/:userEmail?userName=:userName page", async () => {
        await router.get(urlWithName);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 for authentication-code-remove/:userEmail?userName=:userName page", async () => {
        await router.get(urlWithName).expect(200);
    });

    it("should return expected English content if language version set to English for authentication-code-remove/:userEmail?userName=:userName page", async () => {
        // Given
        const langVersion = "&lang=en";
        const expectedCompanyName = "Doughnuts Limited";
        session.setExtraData(constants.COMPANY_NAME, expectedCompanyName);

        // When
        const response = await router.get(`${urlWithName}${langVersion}`);
        // Then
        expect(response.text).toContain(`${en.remove}${userName}`);
        expect(response.text).toContain(en.authorisation_to_file_online);
        expect(response.text).toContain(`${en.if_you_remove}${userName}`);
        expect(response.text).toContain(`${en.digital_authorisation_this_means_they}${expectedCompanyName}`);
        expect(response.text).toContain(`${en.without_a_current_auth_code}${userName}`);
        expect(response.text).toContain(en.to_let_them_know_you_have_removed);
        expect(response.text).toContain(`${userName}${en.will_still_be_able_to_file}`);
        expect(response.text).toContain(`${en.you_may_wish_to_change_the_auth_code}${userName}`);
        expect(response.text).toContain(en.digital_authorisation);
        expect(response.text).toContain(`${en.if}${userName}`);
        expect(response.text).toContain(en.is_appointed_as_an_officer);
        expect(response.text).toContain(en.i_confirm_that_i_have_read);
        expect(response.text).toContain(en.remove_authorisation);
        expect(response.text).toContain(enCommon.cancel);
    });

    it("should return expected Welsh content if language version set to Welsh authentication-code-remove/:userEmail?userName=:userName page", async () => {
        // Given
        const langVersion = "&lang=cy";
        const expectedCompanyName = "Doughnuts Limited";
        session.setExtraData(constants.COMPANY_NAME, expectedCompanyName);

        // When
        const response = await router.get(`${urlWithName}${langVersion}`);
        // Then
        expect(response.text).toContain(`${cy.remove}${userName}`);
        expect(response.text).toContain(cy.authorisation_to_file_online);
        expect(response.text).toContain(`${cy.if_you_remove}${userName}`);
        expect(response.text).toContain(`${cy.digital_authorisation_this_means_they}${expectedCompanyName}`);
        expect(response.text).toContain(`${cy.without_a_current_auth_code}${userName}`);
        expect(response.text).toContain(cy.to_let_them_know_you_have_removed);
        expect(response.text).toContain(`${cy.remove_person_summary_start}${userName}`);
        expect(response.text).toContain(`${userName}${cy.will_still_be_able_to_file}`);
        expect(response.text).toContain(`${cy.you_may_wish_to_change_the_auth_code}${userName}`);
        expect(response.text).toContain(`${cy.if}${userName}`);
        expect(response.text).toContain(cy.is_appointed_as_an_officer);
        expect(response.text).toContain(cy.i_confirm_that_i_have_read);
        expect(response.text).toContain(cy.remove_authorisation);
        expect(response.text).toContain(cyCommon.cancel);
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
        await router.get(urlWithEmail).expect(200);

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
        await router.get(urlWithEmail).expect(200);

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
        await router.get(urlWithEmail).expect(200);

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
        await router.get(urlWithEmail).expect(200);

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
        const response = await router.get(urlWithEmail);
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
    it("should redirect, and return status 302 if companyNumber equals pageIndicator but userEmail is not included in userEmailsArray", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: undefined };
            req.session = session;
            next();
        });
        const userEmail = "test@test.com";
        const pageIndicator = "123456";
        const userEmailsArray = ["firstEmail@test.com"];

        setExtraData(session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, pageIndicator);
        setExtraData(session, constants.USER_EMAIL, userEmail);
        setExtraData(session, constants.USER_EMAILS_ARRAY, userEmailsArray);
        // When
        const response = await router.get(urlWithEmail);

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
        const response = await router.get(urlWithEmail);

        // Then
        expect(response.status).toEqual(302);
    });

    it("should return status 302 on page redirect for authentication-code-remove/:userEmail page", async () => {
        redirectPageSpy.mockReturnValue(true);
        await router.get(urlWithEmail).expect(302);
    });

    it("should return correct response message including desired url path for authentication-code-remove/:userEmail page", async () => {
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        const response = await router.get(urlWithEmail);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    it("should return status 302 on page redirect for authentication-code-remove/:userEmail?userName=:userName page", async () => {
        redirectPageSpy.mockReturnValue(true);
        await router.get(urlWithEmail).expect(302);
    });

    it("should return correct response message including desired url path for authentication-code-remove/:userEmail?userName=:userName page", async () => {
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        const response = await router.get(urlWithEmail);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

});
