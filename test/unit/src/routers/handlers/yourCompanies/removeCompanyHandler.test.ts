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
import { AssociationState } from "../../../../../../src/types/associations";

jest.mock("../../../../../../src/lib/Logger");

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
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
            viewData: {},
            returnInfo: "return view data without errors",
            condition: "there is no error saved in session"
        },
        {
            method: constants.GET,
            error: {
                confirmRemoval: {
                    text: "you_must_select_an_option"
                }
            },
            viewData: {
                errors: {
                    confirmRemoval: {
                        text: "you_must_select_an_option"
                    }
                }
            },
            returnInfo: "return view data with errors",
            condition: "there is error saved in session"
        },
        {
            method: constants.POST,
            error: undefined,
            body: { confirmRemoval: "no" },
            redirectUrl: constants.LANDING_URL,
            returnInfo: "redirect to the landing page",
            condition: "there is no error saved in session and selected option is 'no'"
        },
        {
            method: constants.POST,
            error: undefined,
            body: { confirmRemoval: "yes" },
            redirectUrl: `${constants.LANDING_URL}${constants.REMOVE_COMPANY_CONFIRMED_URL}`,
            associationState: { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "12345" },
            isUserRemoved: constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS,
            returnInfo: "redirect to the confirmation-company-removed page",
            condition: "there is no error saved in session, selected option is 'yes', the company is associated with the user and removal is successful"
        },
        {
            method: constants.POST,
            error: undefined,
            body: { confirmRemoval: "yes" },
            associationState: { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "12345" },
            isUserRemoved: constants.USER_NOT_REMOVED_FROM_COMPANY_ASSOCIATIONS,
            viewData: {
                errors: {
                    generic: {
                        text: "error_removing_company"
                    }
                }
            },
            returnInfo: "return view data with errors",
            condition: "there is no error saved in session, selected option is 'yes', the company is associated with the user but removal is not successful"
        },
        {
            method: constants.POST,
            error: undefined,
            body: { confirmRemoval: "yes" },
            associationState: { state: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER, associationId: "12345" },
            viewData: {
                errors: {
                    generic: {
                        text: "error_removing_company"
                    }
                }
            },
            returnInfo: "return view data with errors",
            condition: "there is no error saved in session, selected option is 'yes' but the company is not associated with the user"
        },
        {
            method: constants.POST,
            error: undefined,
            body: {},
            viewData: {
                errors: {
                    confirmRemoval: {
                        text: "you_must_select_an_option"
                    }
                }
            },
            returnInfo: "return view data with errors",
            condition: "there is no error saved in session, but there is no selected option"
        }
    ])("should $returnInfo if method is $method and $condition",
       async ({ method, error, viewData, body, redirectUrl, associationState, isUserRemoved }) => {
           // Given
           const lang = "en";
           const companyNumber = validActiveCompanyProfile.companyNumber;
           const companyName = validActiveCompanyProfile.companyName;
           const req: Request = mockParametrisedRequest({
               session: new Session(),
               lang,
               params: { companyNumber },
               body,
               requestId: "requestId"
           });
           const res: Response = mockResponse();
           const translations = { key: "value" };
           getTranslationsForViewSpy.mockReturnValueOnce(translations);
           if (method === constants.GET) {
               getExtraDataSpy.mockReturnValueOnce(error);
           } else {
               getExtraDataSpy.mockReturnValue(companyName);
               isOrWasCompanyAssociatedWithUserSpy.mockReturnValueOnce(associationState);
               removeUserFromCompanyAssociationsSpy.mockReturnValueOnce(isUserRemoved);
           }
           getCompanyProfileSpy.mockReturnValueOnce(validActiveCompanyProfile);
           const expectedViewData = {
               templateName: constants.REMOVE_COMPANY_PAGE,
               backLinkHref: constants.LANDING_URL,
               lang: translations,
               companyName,
               companyNumber,
               ...viewData
           };
           // When
           const response = await removeCompanyHandler.execute(req, res, method);
           // Then
           expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
           expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.REMOVE_COMPANY_PAGE);
           let getExtraDataCounter = 0;
           let setExtraDataCounter = 0;
           if (method === constants.GET) {
               expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.YOU_MUST_SELECT_AN_OPTION);
               getExtraDataCounter = ++getExtraDataCounter;
               expect(getCompanyProfileSpy).toHaveBeenCalledTimes(1);
               expect(getCompanyProfileSpy).toHaveBeenCalledWith(companyNumber, "requestId");
               expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyName);
               setExtraDataCounter = ++setExtraDataCounter;
           } else {
               expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME);
               getExtraDataCounter = ++getExtraDataCounter;
               if (body?.confirmRemoval) {
                   expect(deleteExtraDataSpy).toHaveBeenCalledTimes(1);
                   expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.YOU_MUST_SELECT_AN_OPTION);
                   if (body?.confirmRemoval === "yes") {
                       expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME);
                       getExtraDataCounter = ++getExtraDataCounter;
                       expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
                       expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);
                       if (associationState?.state === AssociationState.COMPANY_ASSOCIATED_WITH_USER) {
                           expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledTimes(1);
                           expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledWith(req, associationState?.associationId);
                       }
                       if (!viewData) {
                           expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_STATUS_INACTIVE, true);
                           expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.LAST_REMOVED_COMPANY_NAME, companyName);
                           expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.LAST_REMOVED_COMPANY_NUMBER, companyNumber);
                           setExtraDataCounter = setExtraDataCounter + 3;
                       }
                   }
               } else {
                   expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.YOU_MUST_SELECT_AN_OPTION, viewData?.errors);
                   setExtraDataCounter = ++setExtraDataCounter;
               }
           }
           expect(getExtraDataSpy).toHaveBeenCalledTimes(getExtraDataCounter);
           expect(setExtraDataSpy).toHaveBeenCalledTimes(setExtraDataCounter);
           if (viewData) {
               expect(response).toEqual(expectedViewData);
           } else {
               expect(res.redirect).toHaveBeenCalledTimes(1);
               expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
           }

       });
});
