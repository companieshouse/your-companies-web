import { Request, Response } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as companyProfileService from "../../../../../../src/services/companyProfileService";
import * as constants from "../../../../../../src/constants";
import { RemoveCompanyHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeCompanyHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { mockResponse } from "../../../../../mocks/response.mock";
import { validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getCompanyProfileSpy: jest.SpyInstance = jest.spyOn(companyProfileService, "getCompanyProfile");

describe("RemoveCompanyHandler", () => {
    let removeCompanyHandler: RemoveCompanyHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        removeCompanyHandler = new RemoveCompanyHandler();
    });

    test.each([
        {
            method: constants.GET,
            error: undefined,
            returnInfo: "without errors",
            condition: "there is no error saved in session"
        }
    ])("should return view data $returnInfo if method is $method and $condition",
        async ({ method, error }) => {
            // Given
            const lang = "en";
            const companyNumber = validActiveCompanyProfile.companyNumber;
            const companyName = validActiveCompanyProfile.companyName;
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: { companyNumber }
            });
            const res: Response = mockResponse();
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValueOnce(translations);
            getExtraDataSpy.mockReturnValueOnce(error);
            getCompanyProfileSpy.mockReturnValueOnce(validActiveCompanyProfile);
            const expectedViewData = {
                templateName: constants.REMOVE_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                companyName,
                companyNumber
            };
            // When
            const response = await removeCompanyHandler.execute(req, res, method);
            // Then
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.REMOVE_COMPANY_PAGE);
            expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.YOU_MUST_SELECT_AN_OPTION);
            expect(getCompanyProfileSpy).toHaveBeenCalledTimes(1);
            expect(getCompanyProfileSpy).toHaveBeenCalledWith(companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyName);
            expect(response).toEqual(expectedViewData);
        });
});
