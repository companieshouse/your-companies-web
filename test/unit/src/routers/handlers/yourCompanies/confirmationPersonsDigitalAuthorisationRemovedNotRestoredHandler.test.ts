import {
    ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler
} from "../../../../../../src/routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler";
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

describe("ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler", () => {
    let confirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler: ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        confirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler = new ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler();
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
            const userNameOrEmail = "test@example.com";
            const personRemovedConfirmationData: PersonRemovedConfirmation = {
                userNameOrEmail,
                companyName,
                companyNumber
            };
            getExtraDataSpy
                .mockReturnValueOnce(personRemovedConfirmationData)
                .mockReturnValueOnce(companyNumber);
            const managePeopleHref = `/your-companies/manage-authorised-people/${companyNumber}`;
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValue(managePeopleHref);
            const viewData = {
                templateName: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                companyName,
                companyNumber,
                userNameOrEmail,
                managePeopleHref
            };
            // When
            const response = await confirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler.execute(req);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.PERSON_REMOVED_CONFIRMATION_DATA);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_PAGE);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            expect(response).toEqual(viewData);

        });
});
