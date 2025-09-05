import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { LANDING_URL } from "../../../../src/constants";
import en from "../../../../locales/en/confirmation-your-digital-authorisation-restored.json";
import cy from "../../../../locales/cy/confirmation-your-digital-authorisation-restored.json";
import enCommon from "../../../../locales/en/common.json";
import cyCommon from "../../../../locales/cy/common.json";

const router = supertest(app);
const companyNumber = "1122334455";
const companyName = "ACME LTD";
const url = `/your-companies/company/${companyNumber}/confirmation-your-digital-authorisation-restored`;

const session: Session = new Session();
session.data.extra_data.confirmedCompanyForAssociation = { companyNumber, companyName };

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});
jest.mock("../../../../src/lib/Logger");

describe("GET /your-companies/company/1122334455/confirmation-your-digital-authorisation-restored", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, auth and company authorisation before returning the confirmation-your-digital-authorisation-restored page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        // Given
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and expected $langInfo content if language set to $langVersion",
        async ({ langVersion, lang, langCommon }) => {
            // When
            const response = await router.get(langVersion ? `${url}?lang=${langVersion}` : url);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(langCommon.success);
            expect(response.text).toContain(lang.digital_authorisation_restored_for);
            expect(response.text).toContain(lang.go_to_your_companies);
            expect(response.text).toContain(lang.keep_the_authentication_code);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.you_can_now);
            expect(response.text).toContain(lang.you_can_now_options[0]);
            expect(response.text).toContain(lang.you_can_now_options[1]);
            expect(response.text).toContain(lang.you_can_now_options[2]);
            expect(response.text).toContain(lang.weve_sent_an_email);
        });

    it("should return status 302 and correct response message including desired url path on page redirect", async () => {
        // Given
        const urlPath = LANDING_URL;
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
