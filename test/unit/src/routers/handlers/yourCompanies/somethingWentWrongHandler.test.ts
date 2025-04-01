import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as constants from "../../../../../../src/constants";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { SomethingWentWrongHandler } from "../../../../../../src/routers/handlers/yourCompanies/somethingWentWrongHandler";

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");

describe("SomethingWentWrongHandler", () => {
    let somethingWentWrongHandler: SomethingWentWrongHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        somethingWentWrongHandler = new SomethingWentWrongHandler();
    });

    it("should return view data", async () => {
        // Given
        const lang = "en";
        const req: Request = mockParametrisedRequest({ session: new Session(), lang });
        const translations = {
            sorry_something_went_wrong: "Sorry something went wrong",
            title_end: " - title end"
        };
        getTranslationsForViewSpy.mockReturnValueOnce(translations);
        const viewData = {
            templateName: constants.SERVICE_UNAVAILABLE,
            lang: translations,
            csrfErrors: true,
            title: "Sorry something went wrong - title end"
        };
        // When
        const response = await somethingWentWrongHandler.execute(req);
        // Then
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.SERVICE_UNAVAILABLE);
        expect(response).toEqual(viewData);
    });
});
