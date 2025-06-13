import { RemoveAuthorisationDoNotRestoreHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeAuthorisationDoNotRestoreHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Request, Response } from "express";
import * as constants from "../../../../../../src/constants";
import * as translations from "../../../../../../src/lib/utils/translations";
import { Session } from "@companieshouse/node-session-handler";
import { mockResponse } from "../../../../../mocks/response.mock";
import * as companyProfileService from "../../../../../../src/services/companyProfileService";
import { validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import { AssociationState } from "../../../../../../src/types/associations";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";

jest.mock("../../../../../../src/services/companyProfileService");
jest.mock("../../../../../../src/lib/Logger");

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getCompanyProfileSpy: jest.SpyInstance = jest.spyOn(companyProfileService, "getCompanyProfile");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");

describe("RemoveAuthorisationDoNotRestoreHandler", () => {
    let removeAuthorisationDoNotRestoreHandler: RemoveAuthorisationDoNotRestoreHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        removeAuthorisationDoNotRestoreHandler = new RemoveAuthorisationDoNotRestoreHandler();
    });

    test.each([
        {
            method: constants.GET,
            returnInfo: "return expected viewData object",
            condition: "when loading the remove authorisation do not restore page",
            viewData: {
                templateName: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE,
                cancelLinkHref: constants.LANDING_URL
            }

        },
        {
            method: constants.POST,
            returnInfo: "redirect to the confirmation-authorisation-removed page",
            condition: "the company association state is migrated and removal is successful",
            redirectUrl: `${constants.LANDING_URL}${constants.CONFIRMATION_AUTHORISATION_REMOVED_URL}`,
            associationState: { state: AssociationState.COMPANY_MIGRATED_NOT_YET_ASSOCIATED_WITH_USER, associationId: "12345" },
            removalResult: constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS
        }
    ])("should $returnInfo if method is $method and $condition",
        async ({
            viewData, method, associationState, removalResult, redirectUrl
        }) => {
            // Given
            const lang = "en";
            const companyNumber = validActiveCompanyProfile.companyNumber;
            const companyName = validActiveCompanyProfile.companyName;

            getCompanyProfileSpy.mockReturnValueOnce(validActiveCompanyProfile);

            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(associationState);
            removeUserFromCompanyAssociationsSpy.mockReturnValue(removalResult);
            getFullUrlSpy.mockReturnValue(redirectUrl);

            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber
                }
            });

            const res: Response = mockResponse();

            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValueOnce(translations);

            const expectedViewData = {
                lang: translations,
                companyName,
                companyNumber,
                ...viewData
            };
            // When
            const response = await removeAuthorisationDoNotRestoreHandler.execute(req, res, method);
            // Then
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE);

            if (method === constants.GET) {
                expect(getCompanyProfileSpy).toHaveBeenCalledTimes(1);
                expect(response).toEqual(expectedViewData);
            }

            if (method === constants.POST && associationState?.state === AssociationState.COMPANY_MIGRATED_NOT_YET_ASSOCIATED_WITH_USER) {
                expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
                expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);

                expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledTimes(1);
                expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledWith(req, associationState?.associationId);

                expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
                expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, constants.REMOVE_AUTHORISATION_COMPANY_NUMBER, companyNumber);

                expect(getFullUrlSpy).toHaveBeenCalledTimes(1);
                expect(getFullUrlSpy).toHaveBeenCalledWith(constants.CONFIRMATION_AUTHORISATION_REMOVED_URL);

                expect(res.redirect).toHaveBeenCalledTimes(1);
                expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
            }
        });

    test.each([
        {
            method: constants.POST,
            returnInfo: "throw expected error message",
            condition: "the company association is not in a migrated state",
            redirectUrl: `${constants.LANDING_URL}${constants.CONFIRMATION_AUTHORISATION_REMOVED_URL}`,
            associationState: { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "12345" },
            removalResult: constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS
        },
        {
            method: constants.POST,
            returnInfo: "throw expected error message",
            condition: "the user is not able to be removed from company associations",
            redirectUrl: `${constants.LANDING_URL}${constants.CONFIRMATION_AUTHORISATION_REMOVED_URL}`,
            associationState: { state: AssociationState.COMPANY_MIGRATED_NOT_YET_ASSOCIATED_WITH_USER, associationId: "12345" },
            removalResult: constants.USER_NOT_REMOVED_FROM_COMPANY_ASSOCIATIONS
        },
        {
            method: constants.GET
        }
    ])("should $returnInfo if method is $method and $condition",
        async ({
            method, associationState, removalResult
        }) => {
            // Given
            const companyNumber = validActiveCompanyProfile.companyNumber;

            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(associationState);
            removeUserFromCompanyAssociationsSpy.mockReturnValue(removalResult);

            const req: Request = mockParametrisedRequest({
                session: new Session(),
                params: {
                    companyNumber
                }
            });

            const res: Response = mockResponse();

            // Then
            if (associationState?.state === AssociationState.COMPANY_ASSOCIATED_WITH_USER) {
                await expect(removeAuthorisationDoNotRestoreHandler.execute(req, res, method)).rejects.toThrow(`Cannot remove company ${companyNumber} as it is not associated with the user`);
            }

            if (removalResult === constants.USER_NOT_REMOVED_FROM_COMPANY_ASSOCIATIONS) {
                await expect(removeAuthorisationDoNotRestoreHandler.execute(req, res, method)).rejects.toThrow(`Unexpected result when removing company ${companyNumber}: ${removalResult}`);
            }
        });
});
