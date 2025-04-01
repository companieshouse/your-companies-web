import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../../src/constants";
import { RemoveAuthorisedPersonHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeAuthorisedPersonHandler";
import { Session } from "@companieshouse/node-session-handler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");

describe("RemoveAuthorisedPersonHandler", () => {
    let removeAuthorisedPersonHandler: RemoveAuthorisedPersonHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        removeAuthorisedPersonHandler = new RemoveAuthorisedPersonHandler();
    });

    test.each([
        {
            method: constants.GET,
            query: { userName: "John Smith" },
            error: undefined,
            viewData: {
                userName: "John Smith"
            },
            returnInfo: "without errors",
            condition: "no error message is saved in session"
        },
        {
            method: constants.GET,
            query: { userName: "John Smith" },
            error: {
                confirmRemoval: {
                    text: "error_message"
                }
            },
            viewData: {
                userName: "John Smith",
                errors: {
                    confirmRemoval: {
                        text: "error_message"
                    }
                }
            },
            returnInfo: "with errors",
            condition: "an error message is saved in session"
        },
        {
            method: constants.POST,
            body: {},
            query: { userName: "John Smith" },
            error: {
                confirmRemoval: {
                    text: constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ
                }
            },
            viewData: {
                userName: "John Smith",
                errors: {
                    confirmRemoval: {
                        text: constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ
                    }
                }
            },
            returnInfo: "with errors",
            condition: "confirmRemoval entry not present in request body"
        },
        {
            method: constants.POST,
            body: { confirmRemoval: "yes" },
            query: {},
            error: undefined,
            viewData: {
                userName: undefined
            },
            removal: {
                removePerson: "yes",
                userEmail: "test@test.com",
                userName: undefined,
                companyNumber: "12345"
            },
            returnInfo: "without errors",
            condition: "confirmRemoval entry present in request body and user name not provided"
        },
        {
            method: constants.POST,
            body: { confirmRemoval: "yes" },
            query: { userName: "John Smith" },
            error: undefined,
            viewData: {
                userName: "John Smith"
            },
            removal: {
                removePerson: "yes",
                userEmail: "test@test.com",
                userName: "John Smith",
                companyNumber: "12345"
            },
            returnInfo: "without errors",
            condition: "confirmRemoval entry present in request body and user name provided"
        }
    ])("should return view data $returnInfo if method is $method and $condition",
        async ({ method, error, viewData, body, removal, query }) => {
            // Given
            const lang = "en";
            const companyNumber = "12345";
            const userEmail = "test@test.com";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    userEmail
                },
                query,
                body
            });
            const href = "/href";
            const companyName = "Test Ltd.";
            getExtraDataSpy
                .mockReturnValueOnce(href)
                .mockReturnValueOnce(href)
                .mockReturnValueOnce(companyName)
                .mockReturnValueOnce(error)
                .mockReturnValueOnce(companyNumber);
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValueOnce(translations);
            const expectedViewData = {
                templateName: constants.REMOVE_AUTHORISED_PERSON_PAGE,
                backLinkHref: href,
                lang: translations,
                companyName,
                companyNumber,
                userEmail,
                cancelLinkHref: href,
                ...viewData
            };
            // When
            const response = await removeAuthorisedPersonHandler.execute(req, method);
            // Then
            let deleteExtraDataCallCounter = 1;
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.REMOVE_AUTHORISED_PERSON_PAGE);
            let getExtraDataCounter = 4;
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REFERER_URL);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
            let setExtraDataCounter = 0;
            if (method === constants.POST) {
                if (error) {
                    expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ, error);
                    setExtraDataCounter = ++setExtraDataCounter;
                } else {
                    expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
                    deleteExtraDataCallCounter = ++deleteExtraDataCallCounter;
                    expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER);
                    getExtraDataCounter = ++getExtraDataCounter;
                    expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PERSON, removal);
                    setExtraDataCounter = ++setExtraDataCounter;
                }
            }
            expect(getExtraDataSpy).toHaveBeenCalledTimes(getExtraDataCounter);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(setExtraDataCounter);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(deleteExtraDataCallCounter);
            expect(response).toEqual(expectedViewData);
        });
});
