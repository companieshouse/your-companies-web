import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { getUrlWithCompanyNumber } from "../../../../src/lib/utils/urlUtils";
import * as en from "../../../../src/locales/en/translation/add-presenter.json";
import * as cy from "../../../../src/locales/cy/translation/add-presenter.json";
import * as constants from "../../../../src/constants";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../src/services/companyProfileService");

const router = supertest(app);
const companyNumber = "12345678";
const urlwithCompNum = "/your-companies/add-presenter/:companyNumber";
const url = getUrlWithCompanyNumber(urlwithCompNum, companyNumber);
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});
describe(`GET ${url}`, () => {
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

        const response = await router.get(`${url}`);

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
