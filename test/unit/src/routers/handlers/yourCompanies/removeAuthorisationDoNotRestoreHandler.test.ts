import { RemoveAuthorisationDoNotRestoreHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeAuthorisationDoNotRestoreHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Request } from "express";
import * as constants from "../../../../../../src/constants";
import * as translations from "../../../../../../src/lib/utils/translations";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../../../src/services/companyProfileService");
jest.mock("../../../../../../src/lib/Logger");

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");

describe("RemoveAuthorisationDoNotRestoreHandler", () => {
    let removeAuthorisationDoNotRestoreHandler: RemoveAuthorisationDoNotRestoreHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        removeAuthorisationDoNotRestoreHandler = new RemoveAuthorisationDoNotRestoreHandler();
    });

    test.each([
        {
            condition: "Basic test that doesn't do anything NEEDS TO CHANGE",
            method: constants.GET,
            viewData: {
                cancelLinkHref: constants.MANAGE_AUTHORISED_PEOPLE_URL
            }
        }
    ])("should return expected viewData object if method is $method and $condition",
        async ({
            viewData
        }) => {
            // Given
            const lang = "en";
            const companyName = "Croissant Holdings Ltd";
            const companyNumber = "FL123456";

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
                templateName: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE,
                lang: translations,
                companyName,
                companyNumber,
                ...viewData
            };
            // When
            const response = await removeAuthorisationDoNotRestoreHandler.execute(req);
            // Then
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE);
            expect(response).toEqual(expectedViewData);
        });
});
