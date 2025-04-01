import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../../src/constants";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { RemoveCompanyConfirmedHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeCompanyConfirmedHandler";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");

describe("RemoveCompanyConfirmedHandler", () => {
    let removeCompanyConfirmedHandler: RemoveCompanyConfirmedHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        removeCompanyConfirmedHandler = new RemoveCompanyConfirmedHandler();
    });

    it("should return view data", async () => {
        // Given
        const lang = "en";
        const req: Request = mockParametrisedRequest({ session: new Session(), lang });
        const translations = { key: "value" };
        getTranslationsForViewSpy.mockReturnValueOnce(translations);
        const companyName = "Test Ltd.";
        const companyNumber = "123456";
        getExtraDataSpy
            .mockReturnValueOnce(companyName)
            .mockReturnValueOnce(companyNumber);
        const viewData = {
            templateName: constants.REMOVE_COMPANY_CONFIRMED,
            buttonHref: constants.LANDING_URL,
            lang: translations,
            companyName,
            companyNumber
        };
        // When
        const response = await removeCompanyConfirmedHandler.execute(req);
        // Then
        expect(getExtraDataSpy).toHaveBeenCalledTimes(2);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.LAST_REMOVED_COMPANY_NAME);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.LAST_REMOVED_COMPANY_NUMBER);
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.REMOVE_COMPANY_CONFIRMED);
        expect(response).toEqual(viewData);
    });
});
