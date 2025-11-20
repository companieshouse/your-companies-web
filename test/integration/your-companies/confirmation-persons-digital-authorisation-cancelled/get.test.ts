import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../locales/en/confirmation-persons-digital-authorisation-cancelled.json";
import cy from "../../../../locales/cy/confirmation-persons-digital-authorisation-cancelled.json";
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

describe("GET /your-companies/confirmation-persons-digital-authorisation-cancelled", () => {
    const url = "/your-companies/confirmation-persons-digital-authorisation-cancelled";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the person's digital authorisation cancel confirmed page", async () => {
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
           const companyName = "TEST LTD.";
           const companyNumber = "12345678";
           const userNameOrEmail = "test@example.com";
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
           expect(response.text).toContain(lang.digital_authorisation_cancelled);
           expect(response.text).toContain(lang.go_to_digitally_authorised_people);
           expect(response.text).toContain(lang.page_header);
           expect(response.text).toContain(lang.to_file_online_for);
           expect(response.text).toContain(lang.weve_sent_an_email_to_any_people);
           expect(response.text).toContain(lang.youve_successfully_cancelled_digital_authorisation_for);
       });
});
