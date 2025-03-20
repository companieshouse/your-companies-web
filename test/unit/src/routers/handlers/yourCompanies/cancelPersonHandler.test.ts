import { Request, Response } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { CancelPersonHandler } from "../../../../../../src/routers/handlers/yourCompanies/cancelPersonHandler";
import { mockResponse } from "../../../../../mocks/response.mock";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const res: Response = mockResponse();

describe("CancelPersonHandler", () => {
    let cancelPersonHandler: CancelPersonHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        cancelPersonHandler = new CancelPersonHandler();
    });

    test.each([
        {
            method: constants.GET,
            getExtraDataKeys: [
                constants.REFERER_URL,
                constants.COMPANY_NAME,
                constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
            ],
            error: {
                cancelPerson: {
                    text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
                }
            },
            viewData: {
                errors: {
                    cancelPerson: {
                        text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
                    }
                }
            },
            return: "view data with error message",
            condition: "there are errors"
        },
        {
            method: constants.GET,
            getExtraDataKeys: [
                constants.REFERER_URL,
                constants.COMPANY_NAME,
                constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
            ],
            viewData: {},
            return: "view data without error message",
            condition: "there are no errors"
        },
        {
            method: constants.POST,
            getExtraDataKeys: [
                constants.REFERER_URL,
                constants.COMPANY_NAME,
                constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
            ],
            cancelPerson: undefined,
            viewData: {
                errors: {
                    cancelPerson: {
                        text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
                    }
                }
            },
            return: "view data with error message",
            condition: "there are errors"
        },
        {
            method: constants.POST,
            getExtraDataKeys: [
                constants.REFERER_URL,
                constants.COMPANY_NAME,
                constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION,
                constants.COMPANY_NUMBER
            ],
            cancelPerson: "yes",
            viewData: {},
            return: "view data without error message",
            condition: "there are no errors"
        }
    ])("should return $return when method is $method and $condition",
        async ({ method, getExtraDataKeys, viewData, error, cancelPerson }) => {
            // Given
            const lang = "en";
            const buttonHref = "/test/button-url";
            const userEmail = "test@test.com";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: { userEmail },
                originalUrl: buttonHref,
                body: { cancelPerson }
            });
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const backLinkHref = "/test/test-url";
            const companyName = "Test Ltd.";
            const companyNumber = "12345";
            const expectedViewData = {
                templateName: constants.CANCEL_PERSON_PAGE,
                lang: translations,
                backLinkHref,
                companyName,
                userEmail,
                buttonHref,
                ...viewData
            };
            getExtraDataSpy
                .mockReturnValueOnce(backLinkHref)
                .mockReturnValueOnce(companyName)
                .mockReturnValueOnce(error)
                .mockReturnValueOnce(companyNumber);
            // When
            const response = await cancelPersonHandler.execute(req, res, method);
            // Then
            let deleteExtraDataCallCounter = 1;
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
            expect(getExtraDataSpy).toHaveBeenCalledTimes(getExtraDataKeys.length);
            for (const key of getExtraDataKeys) {
                expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), key);
            }
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CANCEL_PERSON_PAGE);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(method === constants.POST ? 1 : 0);
            if (method === constants.POST && cancelPerson) {
                deleteExtraDataCallCounter = ++deleteExtraDataCallCounter;
                expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
            } else if (method === constants.POST) {
                const setExtraDataKey = cancelPerson ? constants.CANCEL_PERSON : constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION;
                const setExtraDataValue = cancelPerson ? { cancelPerson, userEmail, companyNumber } : viewData.errors;
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), setExtraDataKey, setExtraDataValue);
            }
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(deleteExtraDataCallCounter);
            expect(response).toEqual(expectedViewData);
        });
});
