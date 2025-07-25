import { ConfirmationPersonRemovedHandler } from "../../../../../../src/routers/handlers/yourCompanies/confirmationPersonRemovedHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Request } from "express";
import * as constants from "../../../../../../src/constants";
import * as translations from "../../../../../../src/lib/utils/translations";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import { PersonRemovedConfirmation } from "../../../../../../src/types/removal";

jest.mock("../../../../../../src/lib/Logger");

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getManageAuthorisedPeopleFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getManageAuthorisedPeopleFullUrl");

describe("ConfirmationPersonRemovedHandler", () => {
    let confirmationPersonRemovedHandler: ConfirmationPersonRemovedHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        confirmationPersonRemovedHandler = new ConfirmationPersonRemovedHandler();
    });

    test.each([
        {
            lang: "en",
            changeAuthenticationCodeHref: constants.CHANGE_COMPANY_AUTH_CODE_URL_ENGLISH
        },
        {
            lang: "cy",
            changeAuthenticationCodeHref: constants.CHANGE_COMPANY_AUTH_CODE_URL_WELSH
        }
    ])("should return expected view data when language set to '$lang'",
        async ({ lang, changeAuthenticationCodeHref }) => {
            // Given
            const req: Request = mockParametrisedRequest({ session: new Session(), lang });
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const companyName = "Test Ltd.";
            const companyNumber = "12345678";
            const userNameOrEmail = "test@example.com";
            const personRemovedConfirmationData: PersonRemovedConfirmation = {
                userNameOrEmail,
                companyNumber,
                companyName
            };
            getExtraDataSpy.mockReturnValue(personRemovedConfirmationData);
            const managePeopleHref = `/your-companies/manage-authorised-people/${companyNumber}`;
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValue(managePeopleHref);
            const viewData = {
                templateName: constants.CONFIRMATION_PERSON_REMOVED_PAGE,
                lang: translations,
                companyName,
                companyNumber,
                userNameOrEmail,
                managePeopleHref,
                changeAuthenticationCodeHref
            };
            // When
            const response = await confirmationPersonRemovedHandler.execute(req);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.PERSON_REMOVED_CONFIRMATION_DATA);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CONFIRMATION_PERSON_REMOVED_PAGE);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
            expect(response).toEqual(viewData);

        });
});
