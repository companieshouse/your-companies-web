import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../locales/en/confirmation-persons-digital-authorisation-restored.json";
import cy from "../../../../locales/cy/confirmation-persons-digital-authorisation-restored.json";
import * as constants from "../../../../src/constants";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";
import { AuthorisedPerson } from "../../../../src/types/associations";

const router = supertest(app);

const session: Session = new Session();
mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});
jest.mock("../../../../src/lib/Logger");

describe("GET /your-companies/confirmation-persons-digital-authorisation-restored", () => {
    const url = "/your-companies/confirmation-persons-digital-authorisation-restored";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the person's digital authorisation restored confirmed page", async () => {
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
            const authorisedPerson: AuthorisedPerson = {
                authorisedPersonEmailAddress: userEmail,
                authorisedPersonCompanyName: companyName
            };
            setExtraData(session, constants.AUTHORISED_PERSON, authorisedPerson);
            setExtraData(session, constants.COMPANY_NUMBER, companyNumber);
            // When
            const response = await router.get(`${url}${langVersion ? `?lang=${langVersion}` : ""}`);
            // Then
            expect(response.status).toBe(200);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(userEmail);
            expect(response.text).toContain(lang.email_sent);
            expect(response.text).toContain(lang.go_to_digitally_authorised_people);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.inviting_them_to_be_digitally_authorised);
            expect(response.text).toContain(lang.they_will_need_to_either_accept_or_decline);
            expect(response.text).toContain(lang.weve_also_sent_an_email);
            expect(response.text).toContain(lang.weve_sent_an_email_to);
        });
});
