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
        const companyName = "TEST LTD.";
        const companyNumber = "12345678";
        getExtraDataSpy.mockReturnValue({ companyName, companyNumber });
        const viewData = {
            templateName: constants.COMPANY_ADD_SUCCESS_PAGE,
            lang: translations,
            companyName,
            companyNumber,
            buttonHref: constants.LANDING_URL
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

    it("should throw an error if referer contains /confirm-company-details", async () => {
        // Given
        const lang = "en";
        const headers = { referer: `${constants.LANDING_URL}${constants.CONFIRM_COMPANY_DETAILS_URL}` };
        const req: Request = mockParametrisedRequest({ session: new Session(), lang, headers });
        const companyName = "TEST LTD.";
        const companyNumber = "12345678";
        getExtraDataSpy.mockReturnValue({ companyName, companyNumber });
        const expectedErrorMessage = `Failed to add company with companyNumber '${companyNumber}': authentication code already present in session.`;

        // Then
        await expect(companyAddSuccessHandler.execute(req)).rejects.toThrow(expectedErrorMessage);
    });
});
