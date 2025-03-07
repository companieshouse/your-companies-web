import mocks from "../../../../../../mocks/all.middleware.mock";
import app from "../../../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../../../../locales/en/remove-authorised-person.json";
import * as cy from "../../../../../../../locales/cy/remove-authorised-person.json";

const router = supertest(app);

const session: Session = new Session();
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

describe("POST /your-companies/remove-authenticated-person/:userEmail", () => {
    const userEmail = "test@test.com";
    const companyNumber = "123456";
    const userName = "John Black";
    const urlWithEmail = `/your-companies/company/${companyNumber}/authentication-code-remove/${userEmail}`;
    const urlWithName = `/your-companies/company/${companyNumber}/authentication-code-remove/${userEmail}?userName=${userName}`;

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.REFERER_URL, "/");
        session.setExtraData(constants.COMPANY_NAME, "General Ltd");
    });

    test.each([
        // Given
        { urlInfo: "/your-companies/remove-authenticated-person/:userEmail", url: urlWithEmail },
        { urlInfo: "/your-companies/remove-authenticated-person/:userEmail?userName=:userName", url: urlWithName }
    ])("should check session and auth before returning the $urlInfo page",
        async ({ url }) => {
            // When
            await router.get(url);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

    test.each([
        // Given
        {
            condition: "checkbox is selected for remove-authenticated-person/:userEmail page",
            langVersion: "en",
            url: urlWithEmail
        },
        {
            condition: "checkbox is selected for remove-authenticated-person/:userEmail page",
            langVersion: "cy",
            url: urlWithEmail
        },
        {
            condition: "checkbox is selected for remove-authenticated-person/:userEmail?userName=:userName page",
            langVersion: "en",
            url: urlWithName
        },
        {
            condition: "checkbox is selected for remove-authenticated-person/:userEmail?userName=:userName page",
            langVersion: "cy",
            url: urlWithName
        }
    ])("should return status 302 if $condition",
        async ({ langVersion, url }) => {
            // When
            const response = await router.post(`${url}?lang=${langVersion}`).send({ confirmRemoval: "confirm" });
            // Then
            expect(response.statusCode).toEqual(302);
        });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            urlInfo: "remove-authenticated-person/:userEmail",
            url: urlWithEmail
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            urlInfo: "remove-authenticated-person/:userEmail",
            url: urlWithEmail
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            urlInfo: "remove-authenticated-person/:userEmail?userName=:userName",
            url: urlWithName
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            urlInfo: "remove-authenticated-person/:userEmail?userName=:userName",
            url: urlWithName
        }
    ])("should return expected $langInfo error message if no option selected and language version set to '$langVersion' for $urlInfo page",
        async ({ langVersion, url, lang }) => {
            // Given
            const langString = url === urlWithName ? "&lang=" : "?lang=";
            const expectedErrorMessage = lang.select_if_you_confirm_that_you_have_read;
            // When
            const response = await router.post(`${url}${langString}${langVersion}`);
            // Then
            expect(response.text).toContain(expectedErrorMessage);
        });
});
