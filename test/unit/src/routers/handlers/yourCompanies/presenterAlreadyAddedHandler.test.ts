import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../../../src/constants";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { PresenterAlreadyAddedHandler } from "../../../../../../src/routers/handlers/yourCompanies/presenterAlreadyAddedHandler";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getCheckPresenterFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getCheckPresenterFullUrl");

describe("PresenterAlreadyAddedHandler", () => {
    let presenterAlreadyAddedHandler: PresenterAlreadyAddedHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        presenterAlreadyAddedHandler = new PresenterAlreadyAddedHandler();
    });

    it("should return view data", async () => {
        // Given
        const lang = "en";
        const req: Request = mockParametrisedRequest({ session: new Session(), lang });
        const translations = { key: "value" };
        getTranslationsForViewSpy.mockReturnValueOnce(translations);
        const companyName = "Test Ltd.";
        const companyNumber = "123456";
        const emailAddress = "test@test.com";
        const backLinkHref = `${constants.LANDING_URL}/${constants.CHECK_PRESENTER_PAGE}/${companyNumber}`;
        getExtraDataSpy
            .mockReturnValueOnce(companyNumber)
            .mockReturnValueOnce(companyName)
            .mockReturnValueOnce(emailAddress);
        getCheckPresenterFullUrlSpy.mockReturnValueOnce(backLinkHref);
        const viewData = {
            templateName: constants.PRESENTER_ALREADY_ADDED_PAGE,
            landingPageUrl: constants.LANDING_URL,
            lang: translations,
            companyName,
            companyNumber,
            emailAddress,
            backLinkHref
        };
        // When
        const response = await presenterAlreadyAddedHandler.execute(req);
        // Then
        expect(getExtraDataSpy).toHaveBeenCalledTimes(3);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.AUTHORISED_PERSON_EMAIL);
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.PRESENTER_ALREADY_ADDED_PAGE);
        expect(getCheckPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
        expect(getCheckPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
        expect(response).toEqual(viewData);
    });
});
