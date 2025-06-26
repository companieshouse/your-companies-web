import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../../src/constants";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import {
    ConfirmationYourDigitalAuthorisationRestoredHandler
} from "../../../../../../src/routers/handlers/yourCompanies/confirmationYourDigitalAuthorisationRestoredHandler";
import { CompanyNameAndNumber } from "../../../../../../src/types/utilTypes";

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

describe("ConfirmationYourDigitalAuthorisationRestoredHandler", () => {
    let confirmationYourDigitalAuthorisationRestoredHandler: ConfirmationYourDigitalAuthorisationRestoredHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        confirmationYourDigitalAuthorisationRestoredHandler = new ConfirmationYourDigitalAuthorisationRestoredHandler();
    });

    it("should return view data", async () => {
        // Given
        const lang = "en";
        const req: Request = mockParametrisedRequest({ session: new Session(), lang });
        const translations = { key: "value" };
        getTranslationsForViewSpy.mockReturnValue(translations);
        const companyName = "Test Ltd.";
        const companyNumber = "12345678";
        const confirmedCompanyForAssociation: CompanyNameAndNumber = {
            companyName,
            companyNumber
        };
        getExtraDataSpy.mockReturnValue(confirmedCompanyForAssociation);
        const viewData = {
            templateName: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE,
            lang: translations,
            companyName,
            companyNumber,
            buttonHref: constants.LANDING_URL
        };
        // When
        const response = await confirmationYourDigitalAuthorisationRestoredHandler.execute(req);
        // Then
        expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE);
        expect(response).toEqual(viewData);
    });
});
