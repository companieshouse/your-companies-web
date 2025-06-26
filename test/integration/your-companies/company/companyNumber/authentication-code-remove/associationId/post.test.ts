import mocks from "../../../../../../mocks/all.middleware.mock";
import app from "../../../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../../../../locales/en/remove-authorised-person.json";
import cy from "../../../../../../../locales/cy/remove-authorised-person.json";
import * as sessionUtils from "../../../../../../../src/lib/utils/sessionUtils";
import { singleConfirmedAssociation } from "../../../../../../mocks/associations.mock";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

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

describe("POST /your-companies/remove-authenticated-person/:associationId", () => {
    const companyNumber = "NI038379";
    const associationId = "654321";
    const urlWithId = `/your-companies/company/${companyNumber}/authentication-code-remove/${associationId}`;

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.REFERER_URL, "/");
        session.setExtraData(constants.COMPANY_NAME, "General Ltd");
    });

    test.each([
        // Given
        { urlInfo: "/your-companies/remove-authenticated-person/:associationId", url: urlWithId }
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
            condition: "checkbox is selected for remove-authenticated-person/:associationId page",
            langVersion: "en",
            url: urlWithId
        },
        {
            condition: "checkbox is selected for remove-authenticated-person/:associationId page",
            langVersion: "cy",
            url: urlWithId
        }
    ])("should return status 200 if $condition",
        async ({ langVersion, url }) => {
            // When
            const response = await router.post(`${url}?lang=${langVersion}`).send({ confirmRemoval: "confirm" });
            // Then
            expect(response.statusCode).toEqual(200);
        });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            urlInfo: "remove-authenticated-person/:associationId",
            url: urlWithId
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            urlInfo: "remove-authenticated-person/:associationId",
            url: urlWithId
        }
    ])("should return expected $langInfo error message if no option selected and language version set to '$langVersion' for $urlInfo page",
        async ({ langVersion, url, lang }) => {
            // Given
            const langString = `?lang=${langVersion}`;
            const expectedErrorMessage = lang.select_if_you_confirm_that_you_have_read;
            getExtraDataSpy
                .mockReturnValueOnce(singleConfirmedAssociation);
            // When
            const response = await router.post(`${url}${langString}`);
            // Then
            expect(response.text).toContain(expectedErrorMessage);
        });
});
