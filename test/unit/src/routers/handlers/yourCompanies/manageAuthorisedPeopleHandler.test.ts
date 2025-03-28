import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as buildPaginationHelper from "../../../../../../src/lib/helpers/buildPaginationHelper";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as validator from "../../../../../../src/lib/validation/generic";
import * as constants from "../../../../../../src/constants";
import { ManageAuthorisedPeopleHandler } from "../../../../../../src/routers/handlers/yourCompanies/manageAuthorisedPeopleHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { AssociationState } from "../../../../../../src/types/associations";
import { companyAssociations, getAssociationList } from "../../../../../mocks/associations.mock";

jest.mock("http-errors");
jest.mock("../../../../../../src/lib/Logger");

const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");
const getAddPresenterFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getAddPresenterFullUrl");
const getManageAuthorisedPeopleFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getManageAuthorisedPeopleFullUrl");
const stringToPositiveIntegerSpy: jest.SpyInstance = jest.spyOn(buildPaginationHelper, "stringToPositiveInteger");
const buildPaginationElementSpy: jest.SpyInstance = jest.spyOn(buildPaginationHelper, "buildPaginationElement");
const setLangForPaginationSpy: jest.SpyInstance = jest.spyOn(buildPaginationHelper, "setLangForPagination");
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
const validatePageNumberSpy: jest.SpyInstance = jest.spyOn(validator, "validatePageNumber");

describe("ManageAuthorisedPeopleHandler", () => {
    let manageAuthorisedPeopleHandler: ManageAuthorisedPeopleHandler;
    const manageAuthorisedPeopleEmailResentFullUrl = `${constants.LANDING_URL}${constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL}`;
    const companyAuthProtectedAuthenticationCodeRemoveFullUrl = `${constants.LANDING_URL}${constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL}`;
    const companyAuthProtectedCancelPersonFullUrl = `${constants.LANDING_URL}${constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL}`;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        getFullUrlSpy
            .mockReturnValueOnce(manageAuthorisedPeopleEmailResentFullUrl)
            .mockReturnValueOnce(companyAuthProtectedAuthenticationCodeRemoveFullUrl)
            .mockReturnValueOnce(companyAuthProtectedCancelPersonFullUrl);
        manageAuthorisedPeopleHandler = new ManageAuthorisedPeopleHandler();
    });

    test.each([
        {
            page: "1",
            pageNumber: 1,
            companyNumber: "",
            isAssociated: { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "1234567890" },
            cancellation: undefined,
            removal: undefined,
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            authorisedPerson: undefined,
            resentSuccessEmail: "",
            returnInfo: "basic view data without pagination",
            condition: "there is no cancellation, removal or email resent triggered and not enough associations for pagination"
        },
        {
            page: "2",
            pageNumber: 2,
            companyNumber: "",
            isAssociated: { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "1234567890" },
            cancellation: undefined,
            removal: undefined,
            companyAssociations: getAssociationList(companyAssociations.items, 15, 1, companyAssociations.items.length + 15, 2),
            isValidPageNumber: true,
            authorisedPerson: undefined,
            resentSuccessEmail: "",
            originalUrl: constants.MANAGE_AUTHORISED_PEOPLE_URL,
            pagination: {
                previous: { href: "href" },
                items: []
            },
            returnInfo: "basic view data with pagination",
            condition: "there is no cancellation, removal or email resent triggered but there is enough associations for pagination"
        }
    ])("should return $returnInfo if $condition",
        async ({ page, pageNumber, companyNumber, isAssociated, cancellation, removal, companyAssociations, isValidPageNumber, authorisedPerson, resentSuccessEmail, originalUrl, pagination }) => {
            // Given
            const lang = "en";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: { page },
                params: { companyNumber },
                originalUrl
            });
            stringToPositiveIntegerSpy.mockReturnValue(pageNumber);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const addPresenterFullUrl = `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/${companyNumber}`;
            getAddPresenterFullUrlSpy.mockReturnValue(addPresenterFullUrl);
            getExtraDataSpy
                .mockReturnValueOnce(cancellation)
                .mockReturnValueOnce(removal)
                .mockReturnValueOnce(authorisedPerson)
                .mockReturnValueOnce(resentSuccessEmail);
            getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
            validatePageNumberSpy.mockReturnValue(isValidPageNumber);
            const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;
            const modifiedOriginalUrl = originalUrl?.replace(":companyNumber", companyNumber);
            if (companyAssociations.totalPages > 1) {
                getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(modifiedOriginalUrl);
                buildPaginationElementSpy.mockReturnValue(pagination);
            }
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(manageAuthorisedPeopleFullUrl);

            const viewData = {
                templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                buttonHref: addPresenterFullUrl + constants.CLEAR_FORM_TRUE,
                cancelUrl: `${constants.LANDING_URL}/company/${companyNumber}/cancel-person/:userEmail`,
                resendEmailUrl: manageAuthorisedPeopleEmailResentFullUrl,
                removeUrl: companyAuthProtectedAuthenticationCodeRemoveFullUrl,
                matomoAddNewAuthorisedPersonGoalId: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID,
                companyAssociations,
                pagination,
                pageNumber: companyAssociations.totalPages > 1 ? pageNumber : 0,
                numberOfPages: companyAssociations.totalPages > 1 ? companyAssociations.totalPages : 0,
                cancelledPerson: "",
                removedPerson: "",
                changeCompanyAuthCodeUrl: undefined,
                showEmailResentSuccess: false,
                resentSuccessEmail: "",
                authorisedPersonSuccess: false,
                authorisedPersonEmailAddress: undefined,
                authorisedPersonCompanyName: undefined
            };
            // When
            const response = await manageAuthorisedPeopleHandler.execute(req);
            // Then
            expect(getFullUrlSpy).toHaveBeenCalledTimes(3);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(page);
            const deleteExtraDataCounter = 2;
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            const getExtraDataCounter = 4;
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CANCEL_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.AUTHORISED_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.RESENT_SUCCESS_EMAIL);
            const getCompanyAssociationsCounter = 1;
            expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, pageNumber - 1);
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, companyAssociations.totalPages);
            let getManageAuthorisedPeopleFullUrlCounter = 1;
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
            if (companyAssociations.totalPages > 1) {
                expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(originalUrl, companyNumber);
                getManageAuthorisedPeopleFullUrlCounter = ++getManageAuthorisedPeopleFullUrlCounter;
                expect(buildPaginationElementSpy).toHaveBeenCalledTimes(1);
                expect(buildPaginationElementSpy).toHaveBeenCalledWith(pageNumber, companyAssociations.totalPages, modifiedOriginalUrl, "");
                expect(setLangForPaginationSpy).toHaveBeenCalledTimes(1);
                expect(setLangForPaginationSpy).toHaveBeenCalledWith(pagination, translations);
            }
            const setExtraDataCounter = 4;
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REFERER_URL, manageAuthorisedPeopleFullUrl);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_EMAILS_ARRAY, companyAssociations.items.map(item => item.userEmail));

            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(deleteExtraDataCounter);
            expect(getExtraDataSpy).toHaveBeenCalledTimes(getExtraDataCounter);
            expect(getCompanyAssociationsSpy).toHaveBeenCalledTimes(getCompanyAssociationsCounter);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(getManageAuthorisedPeopleFullUrlCounter);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(setExtraDataCounter);
            expect(response).toEqual(viewData);
        });
});
