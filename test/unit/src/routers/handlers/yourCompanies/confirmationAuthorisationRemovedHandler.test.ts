import { ConfirmationAuthorisationRemovedHandler } from "../../../../../../src/routers/handlers/yourCompanies/confirmationAuthorisationRemovedHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Request } from "express";
import * as constants from "../../../../../../src/constants";
import * as translations from "../../../../../../src/lib/utils/translations";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import { when } from "jest-when";
import { validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";

jest.mock("../../../../../../src/services/companyProfileService");
jest.mock("../../../../../../src/lib/Logger");

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

describe("ConfirmationAuthorisationRemovedHandler", () => {
    let confirmationAuthorisationRemovedHandler: ConfirmationAuthorisationRemovedHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        confirmationAuthorisationRemovedHandler = new ConfirmationAuthorisationRemovedHandler();
    });

    it("should return expected view data", async () => {
        // Given
        const lang = "en";

        const companyNumber = validActiveCompanyProfile.companyNumber;
        const companyName = validActiveCompanyProfile.companyName;
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.REMOVE_AUTHORISATION_COMPANY_NAME).mockReturnValue(companyName);
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.REMOVE_AUTHORISATION_COMPANY_NUMBER).mockReturnValue(companyNumber);

        const req: Request = mockParametrisedRequest({
            session: new Session(),
            lang,
            params: {
                companyNumber
            }
        });
        const translations = { key: "value" };
        getTranslationsForViewSpy.mockReturnValueOnce(translations);

        const expectedViewData = {
            templateName: constants.CONFIRMATION_AUTHORISATION_REMOVED_PAGE,
            lang: translations,
            companyName,
            companyNumber,
            yourCompaniesHref: constants.LANDING_URL
        };

        // When
        const response = await confirmationAuthorisationRemovedHandler.execute(req);
        // Then
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CONFIRMATION_AUTHORISATION_REMOVED_PAGE);
        expect(getExtraDataSpy).toHaveBeenCalledTimes(2);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_AUTHORISATION_COMPANY_NAME);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_AUTHORISATION_COMPANY_NUMBER);
        expect(response).toEqual(expectedViewData);
    });
});
