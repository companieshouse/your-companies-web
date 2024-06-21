import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../src/locales/en/translation/remove-authorised-person.json";
import * as cy from "../../../../src/locales/cy/translation/remove-authorised-person.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as cyCommon from "../../../../src/locales/cy/translation/common.json";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";

const router = supertest(app);
const userEmail = "test@test.com";
const companyNumber = "123456";
const userName = "John Black";
const urlWithEmail = `/your-companies/company/${companyNumber}/authentication-code-remove/${userEmail}`;
const urlWithName = `/your-companies/company/${companyNumber}/authentication-code-remove/${userEmail}?userName=${userName}`;

const session: Session = new Session();

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

describe("GET /your-companies/company/:companyNumber/authentication-code-remove/:userEmail WITH AND WITHOUT ?userName=:userName", () => {

    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

    beforeEach(() => {
        jest.clearAllMocks;
    });

    redirectPageSpy.mockReturnValue(false);

    it("should check session and auth before returning the /your-companies/authentication-code-remove/:userEmail page", async () => {
        await router.get(urlWithEmail);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 for authentication-code-remove/:userEmail page", async () => {
        await router.get(urlWithEmail).expect(200);
    });

    it("should return expected English content if language version set to English for authentication-code-remove/:userEmail page", async () => {
        // Given
        const langVersion = "?lang=en";
        const expectedCompanyName = "Doughnuts Limited";
        session.setExtraData(constants.COMPANY_NAME, expectedCompanyName);

        // When
        const response = await router.get(`${urlWithEmail}${langVersion}`);
        // Then
        expect(response.text).toContain(`${en.remove}${userEmail}`);
        expect(response.text).toContain(en.authorisation_to_file_online);
        expect(response.text).toContain(`${en.if_you_remove}${userEmail}`);
        expect(response.text).toContain(`${en.digital_authorisation_this_means_they}${expectedCompanyName}`);
        expect(response.text).toContain(en.without_a_current_auth_code);
        expect(response.text).toContain(`${userEmail}${en.to_let_them_know_you_have_removed}`);
        expect(response.text).toContain(`${userEmail}${en.will_still_be_able_to_file}`);
        expect(response.text).toContain(en.you_may_wish_to_change_the_auth_code);
        expect(response.text).toContain(`${userEmail}${en.digital_authorisation}`);
        expect(response.text).toContain(`${en.if}${userEmail}`);
        expect(response.text).toContain(en.is_appointed_as_an_officer);
        expect(response.text).toContain(en.i_confirm_that_i_have_read);
        expect(response.text).toContain(en.remove_authorisation);
        expect(response.text).toContain(enCommon.cancel);
        expect(response.text).not.toContain(userName);
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
        expect(response.text).toContain(`${userEmail}${cy.will_still_be_able_to_file}`);
        expect(response.text).toContain(cy.you_may_wish_to_change_the_auth_code);
        expect(response.text).toContain(`${userEmail}${cy.digital_authorisation}`);
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
        expect(response.text).toContain(`${userName}${cy.will_still_be_able_to_file}`);
        expect(response.text).toContain(`${cy.you_may_wish_to_change_the_auth_code}${userName}`);
        expect(response.text).toContain(cy.digital_authorisation);
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

describe("POST /your-companies/remove-authenticated-person/:userEmail WITH AND WITHOUT ?userName=:userName", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.REFERER_URL, "/");
        session.setExtraData(constants.COMPANY_NAME, "General Ltd");
    });

    it("should check session and auth before returning the /your-companies/remove-authenticated-person/:userEmail page", async () => {
        await router.get(urlWithEmail);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("Should return status 302 if checkbox is selected for remove-authenticated-person/:userEmail page", async () => {
        // Given
        const langVersion = "?lang=en";
        // When
        const response = await router.post(`${urlWithEmail}${langVersion}`).send({ confirmRemoval: "confirm" });
        // Then
        expect(response.statusCode).toEqual(302);
    });

    it("Should return expected English error message if no option selected and language version set to English for remove-authenticated-person/:userEmail page", async () => {
        // Given
        const langVersion = "?lang=en";
        const expectedErrorMessage = en.select_if_you_confirm_that_you_have_read;
        // When
        const response = await router.post(`${urlWithEmail}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedErrorMessage);
    });

    it("Should return expected Welsh error message if no option selected and language version set to Welsh for remove-authenticated-person/:userEmail page", async () => {
        // Given
        const langVersion = "?lang=cy";
        const expectedErrorMessage = cy.select_if_you_confirm_that_you_have_read;
        // When
        const response = await router.post(`${urlWithEmail}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedErrorMessage);
    });

    it("should check session and auth before returning the /your-companies/remove-authenticated-person/:userEmail?userName=:userName page", async () => {
        await router.get(urlWithName);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("Should return status 302 if checkbox is selected for remove-authenticated-person/:userEmail?userName=:userName page", async () => {
        // Given
        const langVersion = "&lang=en";
        // When
        const response = await router.post(`${urlWithName}${langVersion}`).send({ confirmRemoval: "confirm" });
        // Then
        expect(response.statusCode).toEqual(302);
    });

    it("Should return expected English error message if no option selected and language version set to English for remove-authenticated-person/:userEmail?userName=:userName page", async () => {
        // Given
        const langVersion = "&lang=en";
        const expectedErrorMessage = en.select_if_you_confirm_that_you_have_read;
        // When
        const response = await router.post(`${urlWithName}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedErrorMessage);
    });

    it("Should return expected Welsh error message if no option selected and language version set to Welsh for remove-authenticated-person/:userEmail?userName=:userName page", async () => {
        // Given
        const langVersion = "&lang=cy";
        const expectedErrorMessage = cy.select_if_you_confirm_that_you_have_read;
        // When
        const response = await router.post(`${urlWithName}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedErrorMessage);
    });

});
