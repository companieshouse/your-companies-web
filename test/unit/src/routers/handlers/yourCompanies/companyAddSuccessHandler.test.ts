import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../../src/constants";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { CompanyAddSuccessHandler } from "../../../../../../src/routers/handlers/yourCompanies/companyAddSuccessHandler";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");

describe("CompanyAddSuccessHandler", () => {
    let companyAddSuccessHandler: CompanyAddSuccessHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        companyAddSuccessHandler = new CompanyAddSuccessHandler();
    });
    it("should return view data", async () => {
        // Given
        const lang = "en";
        const req: Request = mockParametrisedRequest({ session: new Session(), lang });
        const translations = { key: "value" };
        getTranslationsForViewSpy.mockReturnValue(translations);
        const companyName = "Test Ltd.";
        getExtraDataSpy.mockReturnValue({ companyName });
        const viewData = {
            templateName: constants.COMPANY_ADD_SUCCESS_PAGE,
            lang: translations,
            companyName
        };
        // When
        const response = await companyAddSuccessHandler.execute(req);
        // Then
        expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.COMPANY_ADD_SUCCESS_PAGE);
        expect(response).toEqual(viewData);
    });
});
