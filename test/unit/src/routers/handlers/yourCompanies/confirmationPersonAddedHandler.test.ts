import { ConfirmationPersonAddedHandler } from "../../../../../../src/routers/handlers/yourCompanies/confirmationPersonAddedHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Request } from "express";
import * as constants from "../../../../../../src/constants";
import * as translations from "../../../../../../src/lib/utils/translations";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import { AuthorisedPerson } from "../../../../../../src/types/associations";

jest.mock("../../../../../../src/lib/Logger");

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getManageAuthorisedPeopleFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getManageAuthorisedPeopleFullUrl");

describe("ConfirmationPersonAddedHandler", () => {
    let confirmationPersonAddedHandler: ConfirmationPersonAddedHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        confirmationPersonAddedHandler = new ConfirmationPersonAddedHandler();
    });

    test.each([
        { lang: "en" }, { lang: "cy" }
    ])("should return expected view data when language set to '$lang'",
        async ({ lang }) => {
            // Given
            const req: Request = mockParametrisedRequest({ session: new Session(), lang });
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const companyName = "Test Ltd.";
            const companyNumber = "12345678";
            const userEmail = "test@example.com";
            const authorisedPerson: AuthorisedPerson = {
                authorisedPersonEmailAddress: userEmail,
                authorisedPersonCompanyName: companyName
            };
            getExtraDataSpy
                .mockReturnValueOnce(companyNumber)
                .mockReturnValueOnce(authorisedPerson);
            const managePeopleHref = `/your-companies/manage-authorised-people/${companyNumber}`;
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValue(managePeopleHref);
            const viewData = {
                templateName: constants.CONFIRMATION_PERSON_ADDED_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                companyName,
                companyNumber,
                userEmail,
                managePeopleHref
            };
            // When
            const response = await confirmationPersonAddedHandler.execute(req);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(2);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.AUTHORISED_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CONFIRMATION_PERSON_ADDED_PAGE);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
            expect(response).toEqual(viewData);
        });
});
