import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../src/locales/en/translation/confirmation-person-removed-themselves.json";
import * as cy from "../../../../src/locales/cy/translation/confirmation-person-removed-themselves.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as cyCommon from "../../../../src/locales/cy/translation/common.json";

const router = supertest(app);
const companyNumber = "NI038379";
const companyName = "Acme Ltd";

const url = `/your-companies/confirmation-person-removed-themselves`;
const session: Session = new Session();
session.data.extra_data.removedThemselvesFromCompany = {
    companyNumber,
    companyName
};

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

describe(`GET ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, auth and company authorisation before returning the remove themselves page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(enCommon.success);
        expect(response.text).toContain(en.go_to_your_companies);
        expect(response.text).toContain(en.weve_sent_an_email);
        expect(response.text).toContain(companyName);
        expect(response.text).toContain(companyNumber);
    });
    it("should return expected Welsh content", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cyCommon.success);
        expect(response.text).toContain(cy.go_to_your_companies);
        expect(response.text).toContain(cy.weve_sent_an_email);
    });
});
