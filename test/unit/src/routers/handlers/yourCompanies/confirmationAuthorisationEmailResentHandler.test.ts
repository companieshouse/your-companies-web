import { ConfirmationAuthorisationEmailResentHandler } from "../../../../../../src/routers/handlers/yourCompanies/confirmationAuthorisationEmailResentHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Request } from "express";
import * as constants from "../../../../../../src/constants";
import * as translations from "../../../../../../src/lib/utils/translations";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";

jest.mock("../../../../../../src/lib/Logger");

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getManageAuthorisedPeopleFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getManageAuthorisedPeopleFullUrl");

describe("ConfirmationAuthorisationEmailResentHandler", () => {
    let confirmationAuthorisationEmailResentHandler: ConfirmationAuthorisationEmailResentHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        confirmationAuthorisationEmailResentHandler = new ConfirmationAuthorisationEmailResentHandler();
    });

    test.each([
        { lang: "en" }, { lang: "cy" }
    ])("should return expected view data when language set to '$lang'",
        async ({ lang }) => {
            // Given
            const req: Request = mockParametrisedRequest({ session: new Session(), lang });
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const companyName = "TEST LTD.";
            const companyNumber = "12345678";
            const userEmail = "test@example.com";
            getExtraDataSpy
                .mockReturnValueOnce(companyNumber)
                .mockReturnValueOnce(companyName)
                .mockReturnValueOnce(userEmail);
            const managePeopleHref = `/your-companies/manage-authorised-people/${companyNumber}`;
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValue(managePeopleHref);
            const viewData = {
                templateName: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                companyName,
                companyNumber,
                userEmail,
                managePeopleHref
            };
            // When
            const response = await confirmationAuthorisationEmailResentHandler.execute(req);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(4);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.RESENT_SUCCESS_EMAIL);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_PAGE);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            expect(response).toEqual(viewData);

        });
});
