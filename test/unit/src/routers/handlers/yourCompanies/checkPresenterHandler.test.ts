import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../../../src/constants";
import { CheckPresenterHandler } from "../../../../../../src/routers/handlers/yourCompanies/checkPresenterHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as associationsService from "../../../../../../src/services/associationsService";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getAddPresenterFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getAddPresenterFullUrl");
const postInvitationSpy: jest.SpyInstance = jest.spyOn(associationsService, "postInvitation");

describe("CheckPresenterHandler", () => {
    let checkPresenterHandler: CheckPresenterHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        checkPresenterHandler = new CheckPresenterHandler();
    });

    test.each([
        {
            method: constants.GET,
            viewData: {},
            return: "view data with associationAlreadyExist set to false",
            condition: ""
        },
        {
            method: constants.POST,
            viewData: {},
            authorisedPerson: {
                authorisedPersonEmailAddress: "test@test.com",
                authorisedPersonCompanyName: "TEST LTD."
            },
            return: "view data with associationAlreadyExist set to false",
            condition: "and it successfully calls association service"
        },
        {
            method: constants.POST,
            viewData: { associationAlreadyExist: true },
            return: "view data with associationAlreadyExist set to true",
            condition: "and it unsuccessfully calls association service"
        }
    ])("should return $return when method is $method $condition",
       async ({ method, viewData, authorisedPerson }) => {
           // Given
           const lang = "en";
           const req: Request = mockParametrisedRequest({ session: new Session(), lang });
           const translations = { key: "value" };
           getTranslationsForViewSpy.mockReturnValue(translations);
           const companyName = "TEST LTD.";
           const companyNumber = "12345";
           const authorisedPersonEmail = "test@test.com";
           getExtraDataSpy
               .mockReturnValueOnce(companyName)
               .mockReturnValueOnce(companyNumber)
               .mockReturnValueOnce(authorisedPersonEmail);
           const url = "/your-companies/add-presenter/12345";
           getAddPresenterFullUrlSpy.mockReturnValue(url);
           const getExtraDataKeys = [
               constants.COMPANY_NAME,
               constants.COMPANY_NUMBER,
               constants.AUTHORISED_PERSON_EMAIL
           ];
           if (viewData.associationAlreadyExist) {
               postInvitationSpy.mockRejectedValue(new Error());
           } else {
               postInvitationSpy.mockReturnValue(authorisedPerson);
           }
           const expectedViewData = {
               templateName: constants.CHECK_PRESENTER_PAGE,
               lang: translations,
               backLinkHref: url,
               companyName,
               companyNumber,
               emailAddress: authorisedPersonEmail,
               associationAlreadyExist: false,
               backLinkWithClearForm: `${url}${constants.CLEAR_FORM_TRUE}`,
               ...viewData
           };
           // When
           const response = await checkPresenterHandler.execute(req, method);
           // Then
           expect(getExtraDataSpy).toHaveBeenCalledTimes(getExtraDataKeys.length);
           for (const key of getExtraDataKeys) {
               expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), key);
           }
           expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
           expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CHECK_PRESENTER_PAGE);
           expect(getAddPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
           expect(getAddPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
           if (method === constants.POST) {
               expect(postInvitationSpy).toHaveBeenCalledTimes(1);
               expect(postInvitationSpy).toHaveBeenCalledWith(expect.anything(), companyNumber, authorisedPersonEmail);
               if (!viewData.associationAlreadyExist) {
                   expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
                   expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.AUTHORISED_PERSON, authorisedPerson);
                   expect(deleteExtraDataSpy).toHaveBeenCalledTimes(1);
                   expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.AUTHORISED_PERSON_EMAIL);
               }
           }
           expect(response).toEqual(expectedViewData);
       });
});
