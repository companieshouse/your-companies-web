import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../locales/en/confirmation-persons-digital-authorisation-removed-not-restored.json";
import cy from "../../../../locales/cy/confirmation-persons-digital-authorisation-removed-not-restored.json";
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

describe("GET /your-companies/confirmation-persons-digital-authorisation-removed-not-restored", () => {
    const url = "/your-companies/confirmation-persons-digital-authorisation-removed-not-restored";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the person's digital authorisation removed not restored confirmed page", async () => {
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
            const userNameOrEmail = "test@example.com";
            const personRemovedConfirmationData: PersonRemovedConfirmation = {
                userNameOrEmail,
                companyName,
                companyNumber
            };
            setExtraData(session, constants.PERSON_REMOVED_CONFIRMATION_DATA, personRemovedConfirmationData);
            // When
            const response = await router.get(`${url}${langVersion ? `?lang=${langVersion}` : ""}`);
            // Then
            expect(response.status).toBe(200);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(userNameOrEmail);
            expect(response.text).toContain(lang.digital_authorisation_not_restored);
            expect(response.text).toContain(lang.go_to_digitally_authorised_people);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.digital_authorisation_to_file_online_for);
            expect(response.text).toContain(lang.has_been_removed_from_the_list);
            expect(response.text).toContain(lang.to_let_them_know);
            expect(response.text).toContain(lang.weve_emailed);
            expect(response.text).toContain(lang.you_have_confirmed_you_do_not_want_to_restore);
        });
});
