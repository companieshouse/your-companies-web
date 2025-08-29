import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../locales/en/confirmation-person-removed.json";
import cy from "../../../../locales/cy/confirmation-person-removed.json";
import * as constants from "../../../../src/constants";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";
import { PersonRemovedConfirmation } from "../../../../src/types/removal";

const router = supertest(app);

const session: Session = new Session();
mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});
jest.mock("../../../../src/lib/Logger");

describe("GET /your-companies/confirmation-person-removed", () => {
    const url = "/your-companies/confirmation-person-removed";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the remove person confirmed page", async () => {
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
            lang: en,
            changeAuthenticationCodeHref: constants.CHANGE_COMPANY_AUTH_CODE_URL_ENGLISH,
            userNameOrEmail: "test@example.com"
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            changeAuthenticationCodeHref: constants.CHANGE_COMPANY_AUTH_CODE_URL_ENGLISH,
            userNameOrEmail: "test@example.com"
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            changeAuthenticationCodeHref: constants.CHANGE_COMPANY_AUTH_CODE_URL_WELSH,
            userNameOrEmail: "test@example.com"
        }
    ])("should return expected $langInfo content when lang is '$langVersion'",
        async ({ langVersion, lang, changeAuthenticationCodeHref, userNameOrEmail }) => {
            // Given
            const companyName = "TEST LTD.";
            const companyNumber = "12345678";
            const personRemovedConfirmationData: PersonRemovedConfirmation = {
                userNameOrEmail,
                companyNumber,
                companyName
            };
            setExtraData(session, constants.PERSON_REMOVED_CONFIRMATION_DATA, personRemovedConfirmationData);
            // When
            const response = await router.get(`${url}${langVersion ? `?lang=${langVersion}` : ""}`);
            // Then
            expect(response.status).toBe(200);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(userNameOrEmail);
            expect(response.text).toContain(lang.change_the_authentication_code);
            expect(response.text).toContain(lang.for_this_company_if);
            expect(response.text).toContain(lang.go_to_digitally_authorised_people);
            expect(response.text).toContain(lang.is_no_longer_digitally_authorised);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.still_has_access_to_it);
            expect(response.text).toContain(lang.to_let_them_know);
            expect(response.text).toContain(lang.weve_emailed);
            expect(response.text).toContain(lang.you_may_wish_to);
            expect(response.text).toContain(changeAuthenticationCodeHref);
        });
});
