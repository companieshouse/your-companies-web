import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import * as en from "../../../../locales/en/add-presenter.json";
import * as cy from "../../../../locales/cy/add-presenter.json";
import * as constants from "../../../../src/constants";
import { getExtraData, setExtraData } from "../../../../src/lib/utils/sessionUtils";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../src/services/companyProfileService");

const router = supertest(app);
const url = "/your-companies/add-presenter/12345678";
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.headers = { referrer: "testUrl.com/confirmation-person-removed" };
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
describe(`GET ${url}`, () => {

    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.COMPANY_NUMBER, "12345678");
        session.setExtraData(constants.COMPANY_NAME, "Test Company");
    });

    redirectPageSpy.mockReturnValue(false);

    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.tell_us_the_email);
        expect(response.text).toContain(en.you_can_change_who);
        expect(response.text).toContain(en.email_address);
    });

    it("should return expected Welsh content if Welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.tell_us_the_email);
        expect(response.text).toContain(cy.you_can_change_who);
        expect(response.text).toContain(cy.email_address);
    });

    it("should validate and display invalid input and error if input stored in session", async () => {
        const expectedInput = "bad email";
        session.setExtraData("proposedEmail", expectedInput);

        const response = await router.get(`${url}?lang=en`);

        expect(response.text).toContain(expectedInput);
        expect(response.text).toContain("Enter an email address in the correct format");
    });
    it("should not display input cf is true", async () => {
        const expectedInput = "bad email";
        session.setExtraData("proposedEmail", expectedInput);

        const response = await router.get(`${url}?lang=en&cf=true`);

        expect(response.text).not.toContain(expectedInput);
        expect(response.text).not.toContain("Enter an email address in the correct format");
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
        const response = await router.get(url);
        expect(response.status).toEqual(200);

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
        const response = await router.get(url);
        expect(response.status).toEqual(200);

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
        const response = await router.get(url);
        expect(response.status).toEqual(200);

    });

    it("should delete the manage authorised people page indicator in extraData on page load", async () => {
        // Given
        const MANAGE_AUTHORISED_PEOPLE_INDICATOR = "manageAuthorisedPeopleIndicator";
        const value = true;
        setExtraData(session, MANAGE_AUTHORISED_PEOPLE_INDICATOR, value);
        const data = getExtraData(session, MANAGE_AUTHORISED_PEOPLE_INDICATOR);

        // When
        await router.get(url);
        const resultData = getExtraData(session, MANAGE_AUTHORISED_PEOPLE_INDICATOR);

        // Then
        expect(data).toBeTruthy();
        expect(resultData).toBeUndefined();
    });

    it("should return status 302 on page redirect", async () => {
        redirectPageSpy.mockReturnValue(true);
        await router.get(url).expect(302);
    });

    it("should return correct response message including desired url path", async () => {
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        const response = await router.get(url);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

});

describe(`POST ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.COMPANY_NUMBER, "12345678");
        session.setExtraData(constants.COMPANY_NAME, "Test Company");
    });

    it("should check session, company and user auth before routing to controller", async () => {
        await router.post(url).send({ email: "" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should display current page with error message if no email provided", async () => {
        const response = await router.post(url).send({ email: "" });
        expect(response.text).toContain(en.errors_email_required);
    });

    it("should display current page with error message if email invalid", async () => {
        const response = await router.post(url).send({ email: "abc" });
        expect(response.text).toContain(en.errors_email_invalid);
    });

    it("should redirect to the check presenter page", async () => {
        const response = await router.post(url).send({ email: "bob@bob.com" });
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual("/your-companies/add-presenter-check-details/12345678");
    });
});
