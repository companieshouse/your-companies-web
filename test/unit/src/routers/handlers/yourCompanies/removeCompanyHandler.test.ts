import { Request, Response } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as constants from "../../../../../../src/constants";
import { RemoveCompanyHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeCompanyHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { mockResponse } from "../../../../../mocks/response.mock";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");

describe("RemoveCompanyHandler", () => {
    let removeCompanyHandler: RemoveCompanyHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        removeCompanyHandler = new RemoveCompanyHandler();
    });

    test.each([
        {
            method: constants.GET
        }
    ])("", async ({ method }) => {
        // Given
        const lang = "en";
        const companyNumber = "12345";
        const req: Request = mockParametrisedRequest({
            session: new Session(),
            lang,
            params: { companyNumber }
        });
        const res: Response = mockResponse();
        // When
        const response = await removeCompanyHandler.execute(req, res, method);
        // Then
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.REMOVE_COMPANY_PAGE);
    });
});
