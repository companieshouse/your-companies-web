import mocks from "../../../../../../mocks/all.middleware.mock";
import app from "../../../../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../../../../locales/en/remove-authorised-person.json";
import cy from "../../../../../../../locales/cy/remove-authorised-person.json";
import enCommon from "../../../../../../../locales/en/common.json";
import cyCommon from "../../../../../../../locales/cy/common.json";
import * as sessionUtils from "../../../../../../../src/lib/utils/sessionUtils";
import { singleConfirmedAssociation } from "../../../../../../mocks/associations.mock";
import * as constants from "../../../../../../../src/constants";

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

describe("GET /your-companies/company/:companyNumber/authentication-code-remove/:associationId", () => {
    const userEmail = singleConfirmedAssociation.userEmail;
    const companyNumber = singleConfirmedAssociation.companyNumber;
    const companyName = singleConfirmedAssociation.companyName;
    const userName = "John Black";
    const associationId = singleConfirmedAssociation.id;
    const url = `/your-companies/company/${companyNumber}/authentication-code-remove/${associationId}`;

    beforeEach(() => {
        jest.clearAllMocks;
    });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            pathInfo: "authentication-code-remove/:associationId",
            includedText: userEmail,
            excludedText: userName,
            url
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            pathInfo: "authentication-code-remove/:associationId",
            includedText: userEmail,
            excludedText: userName,
            url
        }
    ])("should check session and auth and return status 200 and expected $langInfo content if language version set to '$langVersion' for $pathInfo page",
        async ({ langVersion, lang, langCommon, includedText, excludedText, url }) => {
            // Given
            getExtraDataSpy
                .mockReturnValueOnce(singleConfirmedAssociation);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(response.status).toEqual(200);
            expect(response.text).toContain(`${lang.remove}${includedText}`);
            expect(response.text).toContain(lang.authorisation_to_file_online);
            expect(response.text).toContain(`${lang.if_you_remove}${includedText}`);
            expect(response.text).toContain(`${lang.digital_authorisation_this_means_they}${companyName}`);
            expect(response.text).toContain(`${includedText}${lang.will_still_be_able_to_file}`);
            expect(response.text).toContain(`${lang.if}${includedText}`);
            expect(response.text).toContain(lang.is_appointed_as_an_officer);
            expect(response.text).toContain(lang.i_confirm_that_i_have_read);
            expect(response.text).toContain(lang.remove_authorisation);
            expect(response.text).toContain(langCommon.cancel);
            expect(response.text).toContain(lang.without_a_current_auth_code);
            expect(response.text).toContain(`${includedText}${lang.to_let_them_know_you_have_removed}`);
            expect(response.text).toContain(lang.you_may_wish_to_change_the_auth_code);
            expect(response.text).toContain(`${includedText}${lang.digital_authorisation}`);
            expect(response.text).not.toContain(excludedText);
            expect(response.text).toContain(`${lang.without_a_current_auth_code}${includedText}`);
            expect(response.text).toContain(lang.to_let_them_know_you_have_removed);
            expect(response.text).toContain(`${lang.you_may_wish_to_change_the_auth_code}${includedText}`);
            expect(response.text).toContain(lang.digital_authorisation);
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
