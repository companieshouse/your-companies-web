import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as validation from "../../../../../../src/lib/validation/generic";
import * as constants from "../../../../../../src/constants";
import { AddPresenterHandler } from "../../../../../../src/routers/handlers/yourCompanies/addPresenterHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getManageAuthorisedPeopleFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getManageAuthorisedPeopleFullUrl");
const validateEmailStringSpy: jest.SpyInstance = jest.spyOn(validation, "validateEmailString");
const validateClearFormSpy: jest.SpyInstance = jest.spyOn(validation, "validateClearForm");

describe("AddPresenterHandler", () => {
    let addPresenterHandler: AddPresenterHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        addPresenterHandler = new AddPresenterHandler();
    });

    test.each([
        {
            getExtraDataKeys: [
                constants.PROPOSED_EMAIL,
                constants.AUTHORISED_PERSON_EMAIL
            ],
            proposedEmail: "",
            authorisedPersonEmail: undefined,
            viewData: {
                errors: {
                    email: { text: constants.ERRORS_EMAIL_REQUIRED }
                },
                authPersonEmail: ""
            },
            method: constants.GET,
            return: "view data with error",
            condition: "proposed email is an empty string"
        },
        {
            getExtraDataKeys: [
                constants.PROPOSED_EMAIL,
                constants.AUTHORISED_PERSON_EMAIL
            ],
            proposedEmail: "test@test@com",
            authorisedPersonEmail: undefined,
            viewData: {
                errors: {
                    email: { text: constants.ERRORS_EMAIL_INVALID }
                },
                authPersonEmail: "test@test@com"
            },
            isEmailValid: false,
            cf: "true",
            method: constants.GET,
            return: "view data with error",
            condition: "proposed email is invalid"
        },
        {
            getExtraDataKeys: [
                constants.PROPOSED_EMAIL,
                constants.AUTHORISED_PERSON_EMAIL
            ],
            proposedEmail: undefined,
            authorisedPersonEmail: "test@test.com",
            viewData: {
                authPersonEmail: "test@test.com"
            },
            isEmailValid: true,
            cf: "",
            method: constants.GET,
            return: "view data",
            condition: "authorised person email provided"
        },
        {
            getExtraDataKeys: [],
            proposedEmail: "test@test.com",
            viewData: {},
            method: constants.POST,
            isEmailValid: true,
            return: "view data without authorised person email",
            condition: "there are no errors"
        },
        {
            getExtraDataKeys: [],
            proposedEmail: "test@test@com",
            viewData: {
                errors: {
                    email: { text: constants.ERRORS_EMAIL_INVALID }
                },
                authPersonEmail: "test@test@com"
            },
            method: constants.POST,
            isEmailValid: false,
            return: "view data with authorised person email",
            condition: "there are errors"
        }
    ])("should return $return when method is $method and $condition",
        async ({ getExtraDataKeys, proposedEmail, authorisedPersonEmail, viewData, method, isEmailValid, cf }) => {
            // Given
            const lang = "en";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: { cf },
                body: { email: proposedEmail }
            });
            const allGetExtraDataKeys = [
                constants.COMPANY_NAME,
                constants.COMPANY_NUMBER,
                ...getExtraDataKeys
            ];
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const companyName = "TEST LTD.";
            const companyNumber = "12345";
            getExtraDataSpy
                .mockReturnValueOnce(companyName)
                .mockReturnValueOnce(companyNumber)
                .mockReturnValueOnce(proposedEmail)
                .mockReturnValueOnce(authorisedPersonEmail);
            const backLinkHref = "/manage-authorised-people/12345";
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValue(backLinkHref);
            const expectedViewData = {
                templateName: constants.ADD_PRESENTER_PAGE,
                lang: translations,
                backLinkHref,
                companyName,
                companyNumber,
                ...viewData
            };
            validateEmailStringSpy.mockReturnValue(isEmailValid);
            validateClearFormSpy.mockReturnValue(cf === "true");
            // When
            const response = await addPresenterHandler.execute(req, method);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(allGetExtraDataKeys.length);
            for (const key of allGetExtraDataKeys) {
                expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), key);
            }
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.ADD_PRESENTER_PAGE);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            expect(validateClearFormSpy).toHaveBeenCalledTimes(1);
            expect(validateClearFormSpy).toHaveBeenCalledWith(cf);
            let deleteExtraDataCallCounter = 0;
            if (cf === "true") {
                expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.AUTHORISED_PERSON_EMAIL);
                expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.PROPOSED_EMAIL);
                deleteExtraDataCallCounter = deleteExtraDataCallCounter + 2;
            }
            expect(validateEmailStringSpy).toHaveBeenCalledTimes(proposedEmail ? 1 : 0);
            if (proposedEmail) {
                expect(validateEmailStringSpy).toHaveBeenCalledWith(proposedEmail);
            }
            expect(setExtraDataSpy).toHaveBeenCalledTimes(method === constants.POST ? 1 : 0);
            if (method === constants.POST) {
                const setExtraDataKey = viewData.errors ? constants.PROPOSED_EMAIL : constants.AUTHORISED_PERSON_EMAIL;
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), setExtraDataKey, proposedEmail);
                const deleteExtraDataKey = viewData.errors ? constants.AUTHORISED_PERSON_EMAIL : constants.PROPOSED_EMAIL;
                expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), deleteExtraDataKey);
                deleteExtraDataCallCounter = ++deleteExtraDataCallCounter;
            }
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(deleteExtraDataCallCounter);
            expect(response).toEqual(expectedViewData);
        });
});
