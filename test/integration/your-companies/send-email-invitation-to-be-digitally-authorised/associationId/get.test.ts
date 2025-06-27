import mocks from "../../../../mocks/all.middleware.mock";
import { Session } from "@companieshouse/node-session-handler";
import app from "../../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import en from "../../../../../locales/en/send-email-invitation-to-be-digitally-authorised.json";
import cy from "../../../../../locales/cy/send-email-invitation-to-be-digitally-authorised.json";
import enCommon from "../../../../../locales/en/common.json";
import cyCommon from "../../../../../locales/cy/common.json";
import * as constants from "../../../../../src/constants";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { migratedAssociation } from "../../../../mocks/associations.mock";
import { when } from "jest-when";

const router = supertest(app);
const url = "/your-companies/send-email-invitation-to-be-digitally-authorised/1234567890";

const session: Session = new Session();

jest.mock("../../../../../src/lib/Logger");
mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

describe("GET /your-companies/send-email-invitation-to-be-digitally-authorised/1234567890", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the send email to be digitally authorised page", async () => {
        // Given
        getExtraDataSpy
            .mockReturnValueOnce("12345678")
            .mockReturnValueOnce("Test Ltd.")
            .mockReturnValueOnce(migratedAssociation.items[0]);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and expected $langInfo content if lang set to $langVersion",
        async ({ langVersion, lang, langCommon }) => {
            // Given
            const companyNumber = migratedAssociation.items[0].companyNumber;
            const companyName = migratedAssociation.items[0].companyName;
            const associationId = migratedAssociation.items[0].id;
            when(getExtraDataSpy).calledWith(expect.any(Session), constants.COMPANY_NUMBER).mockReturnValue(companyNumber);
            when(getExtraDataSpy).calledWith(expect.any(Session), constants.COMPANY_NAME).mockReturnValue(companyName);
            when(getExtraDataSpy).calledWith(expect.any(Session), `${constants.ASSOCIATIONS_ID}_${associationId}`).mockReturnValue(migratedAssociation.items[0]);
            // When
            const response = await router.get(langVersion ? `${url}?lang=${langVersion}` : url);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.well_send_an_email_to);
            expect(response.text).toContain(lang.asking_if_they_want_to_be_digitally_authorised);
            expect(response.text).toContain(lang.name);
            expect(response.text).toContain(lang.email_address);
            expect(response.text).toContain(lang.send_email);
            expect(response.text).toContain(langCommon.cancel);
            expect(response.text).toContain(`${companyName} (${companyNumber})`);
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
