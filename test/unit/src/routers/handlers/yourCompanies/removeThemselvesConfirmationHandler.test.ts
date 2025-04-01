import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../../src/constants";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { RemoveThemselvesConfirmationHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeThemselvesConfirmationHandler";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");

describe("RemoveThemselvesConfirmationHandler", () => {
    let removeThemselvesConfirmationHandler: RemoveThemselvesConfirmationHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        removeThemselvesConfirmationHandler = new RemoveThemselvesConfirmationHandler();
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
            .mockReturnValueOnce({ companyName, companyNumber });
        const viewData = {
            templateName: constants.REMOVED_THEMSELVES,
            buttonHref: constants.LANDING_URL,
            lang: translations,
            companyName,
            companyNumber
        };
        // When
        const response = await removeThemselvesConfirmationHandler.execute(req);
        // Then
        expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVED_THEMSELVES_FROM_COMPANY);
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.REMOVED_THEMSELVES);
        expect(response).toEqual(viewData);
    });
});
