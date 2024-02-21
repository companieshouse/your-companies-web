import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
const router = supertest(app);
const en = require("../../../../src/locales/en/translation/confirmation-company-added.json");
const enCommon = require("../../../../src/locales/en/translation/common.json");
const cy = require("../../../../src/locales/cy/translation/confirmation-company-added.json");
const cyCommon = require("../../../../src/locales/cy/translation/common.json");
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
    beforeEach(() => {
        jest.clearAllMocks();
    });
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

    it("should display 3 bullet points", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.bullet_1);
        expect(response.text).toContain(en.bullet_2);
        expect(response.text).toContain(en.bullet_3);
    });

    it("should return expected Welsh content when welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cyCommon.success);
    });
});
