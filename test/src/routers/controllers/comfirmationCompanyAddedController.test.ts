import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import * as en from "../../../../src/locales/en/translation/confirmation-company-added.json";
import * as cy from "../../../../src/locales/cy/translation/confirmation-company-added.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as cyCommon from "../../../../src/locales/cy/translation/common.json";
import { LANDING_URL } from "../../../../src/constants";

const router = supertest(app);
const url = `/your-companies/confirmation-company-added`;
const companyNumber = "1122334455";
const companyName = "Acme Ltd";
const session: Session = new Session();
session.data.extra_data.confirmedCompanyForAssocation = { companyNumber, companyName };

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

describe(`GET ${url}`, () => {

    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    redirectPageSpy.mockReturnValue(false);

    it("should check session, auth and company authorisation before returning the your-companies page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(enCommon.success);
    });

    it("should display the company name", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain("Acme Ltd");
    });

    it("should display 3 bullet points in English if language set to English", async () => {
        const response = await router.get(`${url}?lang=en`);
        expect(response.text).toContain(en.bullet_1);
        expect(response.text).toContain(en.bullet_2);
        expect(response.text).toContain(en.bullet_3);
    });

    it("should display 3 bullet points in Welsh if language set to Welsh", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.bullet_1);
        expect(response.text).toContain(cy.bullet_2);
        expect(response.text).toContain(cy.bullet_3);
    });

    it("should return expected Welsh content when welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cyCommon.success);
    });

    it("should return status 302 on page redirect", async () => {
        redirectPageSpy.mockReturnValue(true);
        await router.get("/your-companies/confirmation-company-added").expect(302);
    });

    it("should return correct response message including desired url path", async () => {
        const urlPath = LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        const response = await router.get("/your-companies/confirmation-company-added");
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
