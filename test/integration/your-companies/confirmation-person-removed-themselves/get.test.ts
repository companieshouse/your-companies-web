import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../locales/en/confirmation-person-removed-themselves.json";
import cy from "../../../../locales/cy/confirmation-person-removed-themselves.json";
import enCommon from "../../../../locales/en/common.json";
import cyCommon from "../../../../locales/cy/common.json";
import * as constants from "../../../../src/constants";

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
jest.mock("../../../../src/lib/Logger");

describe("GET /your-companies/confirmation-person-removed-themselves", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, auth and company authorisation before returning the remove themselves page", async () => {
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockNavigationMiddleware).toHaveBeenCalled();
    });

    test.each([
        // Given
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return expected $langInfo content if lang set to '$langVersion'",
        async ({ langVersion, lang, langCommon }) => {
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(langCommon.success);
            expect(response.text).toContain(lang.go_to_your_companies);
            expect(response.text).toContain(lang.weve_sent_an_email);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
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
