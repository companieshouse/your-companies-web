import mocks from "../../../../../../mocks/all.middleware.mock";
import app from "../../../../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as constants from "../../../../../../../src/constants";
import en from "../../../../../../../locales/en/cancel-person.json";
import cy from "../../../../../../../locales/cy/cancel-person.json";
const router = supertest(app);
const session: Session = new Session();
const userEmail = "test@test.com";
const companyNumber = "012345678";
const url = `/your-companies/company/${companyNumber}/cancel-person/${userEmail}`;

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../../../../src/lib/Logger");
jest.mock("../../../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

describe("POST /your-companies/company/:companyNumber/cancel-person/:userEmail", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.REFERER_URL, "/");
        session.setExtraData(constants.COMPANY_NAME, "General Ltd");
    });

    it("should check session and auth before returning the /your-companies/company/:companyNumber/cancel-person/:userEmail page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        // Given
        { condition: "'yes' option selected", langVersion: "en", cancelPerson: "yes" },
        { condition: "'no' option selected", langVersion: "en", cancelPerson: "no" },
        { condition: "'yes' option selected", langVersion: "cy", cancelPerson: "yes" },
        { condition: "'no' option selected", langVersion: "cy", cancelPerson: "no" }
    ])("should return status 302 if $condition and lang set to $langVersion",
        async ({ langVersion, cancelPerson }) => {
            // When
            const response = await router.post(`${url}?lang=${langVersion}`).send({ cancelPerson });
            // Then
            expect(response.statusCode).toEqual(302);
        });

    test.each([
        { langInfo: "English", langVersion: "en", errorMessage: en.select_yes_if_you_want_to_cancel_authorisation },
        { langInfo: "Welsh", langVersion: "cy", errorMessage: cy.select_yes_if_you_want_to_cancel_authorisation }
    ])("should return expected $langInfo error message if no option selected and language version set to '$langVersion'",
        async ({ langVersion, errorMessage }) => {
            // When
            const response = await router.post(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(errorMessage);
        });
});
