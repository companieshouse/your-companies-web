import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../locales/en/confirmation-authorisation-email-resent.json";
import cy from "../../../../locales/cy/confirmation-authorisation-email-resent.json";
import * as constants from "../../../../src/constants";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";

const router = supertest(app);

const session: Session = new Session();
mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});
jest.mock("../../../../src/lib/Logger");

describe("GET /your-companies/confirmation-authorisation-email-resent", () => {
    const url = "/your-companies/confirmation-authorisation-email-resent";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the authorisation email resent confirmed page", async () => {
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        {
            langInfo: "English",
            langVersion: undefined,
            lang: en
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy
        }
    ])("should return expected $langInfo content when lang is '$langVersion'",
        async ({ langVersion, lang }) => {
            // Given
            const companyName = "Test Ltd.";
            const companyNumber = "12345678";
            const userEmail = "test@example.com";
            setExtraData(session, constants.COMPANY_NUMBER, companyNumber);
            setExtraData(session, constants.COMPANY_NAME, companyName);
            setExtraData(session, constants.RESENT_SUCCESS_EMAIL, userEmail);
            // When
            const response = await router.get(`${url}${langVersion ? `?lang=${langVersion}` : ""}`);
            // Then
            expect(response.status).toBe(200);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(userEmail);
            expect(response.text).toContain(lang.email_sent);
            expect(response.text).toContain(lang.go_to_digitally_authorised_people);
            expect(response.text).toContain(lang.inviting_them_to_be_digitally_authorised_for);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.they_will_need_to_either_accept_or_decline);
            expect(response.text).toContain(lang.weve_sent_another_email_to);
        });
});
