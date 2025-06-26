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
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";

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
    const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${constants.COMPANY_NUMBER}`;
    const sendEmailInvitationToBeDigitallyAuthorisedBaseUrl = `${constants.LANDING_URL}${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}`;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        getFullUrlSpy
            .mockReturnValueOnce(manageAuthorisedPeopleEmailResentFullUrl)
            .mockReturnValueOnce(companyAuthProtectedAuthenticationCodeRemoveFullUrl)
            .mockReturnValueOnce(sendEmailInvitationToBeDigitallyAuthorisedBaseUrl)
            .mockReturnValueOnce(companyAuthProtectedCancelPersonFullUrl);
        manageAuthorisedPeopleHandler = new ManageAuthorisedPeopleHandler();
    });

    test.each([
        {
            page: "1",
            pageNumber: 1,
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            viewData: {
                pageNumber: 0,
                numberOfPages: 0
            },
            returnInfo: "basic view data without pagination",
            condition: "there is no cancellation, removal or email resent triggered and not enough associations for pagination"
        },
        {
            page: "12345",
            pageNumber: 12345,
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: false,
            viewData: {
                pageNumber: 0,
                numberOfPages: 0
            },
            returnInfo: "basic view data without pagination",
            condition: "there is no cancellation, removal or email resent triggered and not enough associations for pagination but the page number is invalid"
        },
        {
            page: "2",
            pageNumber: 2,
            companyAssociations: getAssociationList(companyAssociations.items, 15, 1, companyAssociations.items.length + 15, 2),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl,
            pagination: {
                previous: { href: "href" },
                items: []
            },
            viewData: {
                pageNumber: 2,
                numberOfPages: 2
            },
            returnInfo: "basic view data with pagination",
            condition: "there is no cancellation, removal or email resent triggered but there is enough associations for pagination"
        }
    ])("should return $returnInfo if $condition",
        async ({
            page,
            pageNumber,
            companyAssociations,
            isValidPageNumber,
            originalUrl,
            pagination,
            viewData
        }) => {
            // Given
            const lang = "en";
            const companyNumber = companyAssociations.items[0].companyNumber;
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: { page },
                params: { companyNumber },
                originalUrl
            });
            stringToPositiveIntegerSpy.mockReturnValue(pageNumber);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(
                {
                    state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                    associationId: "1234567890"
                }
            );
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const addPresenterFullUrl = `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/${companyNumber}`;
            getAddPresenterFullUrlSpy.mockReturnValue(addPresenterFullUrl);
            getExtraDataSpy
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce("");
            getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
            validatePageNumberSpy.mockReturnValue(isValidPageNumber);
            const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;
            const modifiedOriginalUrl = originalUrl?.replace(":companyNumber", companyNumber);
            if (companyAssociations.totalPages > 1) {
                getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(modifiedOriginalUrl);
            }
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(manageAuthorisedPeopleFullUrl);
            buildPaginationElementSpy.mockReturnValue(pagination);
            const finalViewData = {
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
                cancelledPerson: "",
                removedPerson: "",
                changeCompanyAuthCodeUrl: undefined,
                showEmailResentSuccess: false,
                resentSuccessEmail: "",
                authorisedPersonSuccess: false,
                authorisedPersonEmailAddress: undefined,
                authorisedPersonCompanyName: undefined,
                restoreDigitalAuthBaseUrl: `${constants.LANDING_URL}${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}`,
                ...viewData
            };
            const emails = companyAssociations.items.map(item => item.userEmail);
            // When
            const response = await manageAuthorisedPeopleHandler.execute(req);
            // Then
            expect(getFullUrlSpy).toHaveBeenCalledTimes(4);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(page);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(2);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            expect(getExtraDataSpy).toHaveBeenCalledTimes(4);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CANCEL_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.AUTHORISED_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.RESENT_SUCCESS_EMAIL);
            let getCompanyAssociationsCounter = 1;
            expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, pageNumber - 1);
            if (!isValidPageNumber) {
                expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, 0);
                getCompanyAssociationsCounter = ++getCompanyAssociationsCounter;
            }
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, companyAssociations.totalPages);
            let getManageAuthorisedPeopleFullUrlCounter = 1;
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
            if (companyAssociations.totalPages > 1) {
                expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(originalUrl, companyNumber);
                getManageAuthorisedPeopleFullUrlCounter = ++getManageAuthorisedPeopleFullUrlCounter;
                expect(buildPaginationElementSpy).toHaveBeenCalledTimes(1);
                expect(buildPaginationElementSpy).toHaveBeenCalledWith(isValidPageNumber ? pageNumber : 1, companyAssociations.totalPages, modifiedOriginalUrl, "");
                expect(setLangForPaginationSpy).toHaveBeenCalledTimes(1);
                expect(setLangForPaginationSpy).toHaveBeenCalledWith(pagination, translations);
            }
            expect(setExtraDataSpy).toHaveBeenCalledTimes(7 + companyAssociations.items.length);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REFERER_URL, manageAuthorisedPeopleFullUrl);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_EMAILS_ARRAY, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE, true);
            for (const association of companyAssociations.items) {
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
            }
            expect(getCompanyAssociationsSpy).toHaveBeenCalledTimes(getCompanyAssociationsCounter);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(getManageAuthorisedPeopleFullUrlCounter);
            expect(response).toEqual(finalViewData);
        });

    test.each([
        {
            cancellation: {
                cancelPerson: constants.YES,
                userEmail: companyAssociations.items[0].userEmail,
                companyNumber: companyAssociations.items[0].companyNumber
            },
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl,
            viewData: {},
            returnInfo: "basic view data without cancellation",
            condition: "there is cancellation but original URL does not contain confirmation-cancel-person"
        },
        {
            cancellation: {
                cancelPerson: undefined,
                userEmail: companyAssociations.items[0].userEmail,
                companyNumber: companyAssociations.items[0].companyNumber
            },
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl + constants.CONFIRMATION_CANCEL_PERSON_URL,
            viewData: {},
            returnInfo: "basic view data without cancellation",
            condition: "there is cancellation and original URL contain confirmation-cancel-person but cancellation.cancelPerson does not equal to 'yes'"
        },
        {
            cancellation: {
                cancelPerson: constants.YES,
                userEmail: companyAssociations.items[0].userEmail,
                companyNumber: companyAssociations.items[0].companyNumber
            },
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl + constants.CONFIRMATION_CANCEL_PERSON_URL,
            viewData: {
                cancelledPerson: companyAssociations.items[0].userEmail
            },
            isUserRemovedFromCompanyAssociations: constants.TRUE,
            returnInfo: "basic view data with cancellation",
            condition: "there is cancellation and original URL contain confirmation-cancel-person, and cancellation.cancelPerson equal to 'yes', and the user is already removed from company associations"
        },
        {
            cancellation: {
                cancelPerson: constants.YES,
                userEmail: companyAssociations.items[0].userEmail,
                companyNumber: companyAssociations.items[0].companyNumber
            },
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl + constants.CONFIRMATION_CANCEL_PERSON_URL,
            viewData: {
                cancelledPerson: companyAssociations.items[0].userEmail
            },
            isUserRemovedFromCompanyAssociations: undefined,
            removeUserFromCompanyAssociations: constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS,
            returnInfo: "basic view data with cancellation",
            condition: "there is cancellation and original URL contain confirmation-cancel-person, and cancellation.cancelPerson equal to 'yes', and the user is not yet removed from company associations"
        }
    ])("should return $returnInfo if $condition",
        async ({
            cancellation,
            companyAssociations,
            isValidPageNumber,
            originalUrl,
            viewData,
            isUserRemovedFromCompanyAssociations,
            removeUserFromCompanyAssociations
        }) => {
            // Given
            const companyNumber = companyAssociations.items[0].companyNumber;
            const lang = "en";
            const page = "1";
            const pageNumber = 1;
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: { page },
                params: { companyNumber },
                originalUrl
            });
            stringToPositiveIntegerSpy.mockReturnValue(pageNumber);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(
                {
                    state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                    associationId: "1234567890"
                }
            );
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const addPresenterFullUrl = `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/${companyNumber}`;
            getAddPresenterFullUrlSpy.mockReturnValue(addPresenterFullUrl);
            getExtraDataSpy
                .mockReturnValueOnce(cancellation)
                .mockReturnValueOnce(isUserRemovedFromCompanyAssociations)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce("");
            getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
            validatePageNumberSpy.mockReturnValue(isValidPageNumber);
            const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;
            const modifiedOriginalUrl = originalUrl?.replace(":companyNumber", companyNumber);
            if (companyAssociations.totalPages > 1) {
                getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(modifiedOriginalUrl);
            }
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(manageAuthorisedPeopleFullUrl);
            if (!isUserRemovedFromCompanyAssociations) {
                removeUserFromCompanyAssociationsSpy.mockReturnValue(removeUserFromCompanyAssociations);
            }
            const finalViewData = {
                templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                buttonHref: addPresenterFullUrl + constants.CLEAR_FORM_TRUE,
                cancelUrl: `${constants.LANDING_URL}/company/${companyNumber}/cancel-person/:userEmail`,
                resendEmailUrl: manageAuthorisedPeopleEmailResentFullUrl,
                removeUrl: companyAuthProtectedAuthenticationCodeRemoveFullUrl,
                matomoAddNewAuthorisedPersonGoalId: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID,
                companyAssociations,
                pageNumber: 0,
                numberOfPages: 0,
                pagination: undefined,
                cancelledPerson: viewData.cancelledPerson ?? "",
                removedPerson: "",
                changeCompanyAuthCodeUrl: undefined,
                showEmailResentSuccess: false,
                resentSuccessEmail: "",
                authorisedPersonSuccess: false,
                authorisedPersonEmailAddress: undefined,
                authorisedPersonCompanyName: undefined,
                restoreDigitalAuthBaseUrl: `${constants.LANDING_URL}${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}`,
                ...viewData
            };
            const emails = companyAssociations.items.map(item => item.userEmail);
            // When
            const response = await manageAuthorisedPeopleHandler.execute(req);
            // Then
            expect(getFullUrlSpy).toHaveBeenCalledTimes(4);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(page);
            let deleteExtraDataCounter = 2;
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            let getExtraDataCounter = 4;
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CANCEL_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.AUTHORISED_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.RESENT_SUCCESS_EMAIL);
            let setExtraDataCounter = 7 + companyAssociations.items.length;
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REFERER_URL, manageAuthorisedPeopleFullUrl);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_EMAILS_ARRAY, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE, true);
            for (const association of companyAssociations.items) {
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
            }
            let getCompanyAssociationsCounter = 2;
            expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, pageNumber - 1);
            if (originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL)) {
                deleteExtraDataCounter = ++deleteExtraDataCounter;
                expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PERSON);
                if (cancellation.cancelPerson === constants.YES) {
                    expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, undefined, 100000);
                    getCompanyAssociationsCounter = ++getCompanyAssociationsCounter;
                    expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
                    getExtraDataCounter = ++getExtraDataCounter;
                    if (!isUserRemovedFromCompanyAssociations) {
                        expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyAssociations.items[0].id);
                        expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledTimes(1);
                        expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS, constants.TRUE);
                        setExtraDataCounter = ++setExtraDataCounter;
                    }
                }
            }
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, companyAssociations.totalPages);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
            expect(getCompanyAssociationsSpy).toHaveBeenCalledTimes(getCompanyAssociationsCounter);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(deleteExtraDataCounter);
            expect(getExtraDataSpy).toHaveBeenCalledTimes(getExtraDataCounter);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(setExtraDataCounter);
            expect(response).toEqual(finalViewData);
        });

    test.each([
        {
            removal: {
                removePerson: constants.YES,
                userEmail: companyAssociations.items[0].userEmail,
                companyNumber: companyAssociations.items[0].companyNumber
            },
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl,
            viewData: {
                removedPerson: "",
                changeCompanyAuthCodeUrl: undefined
            },
            returnInfo: "basic view data without removal confirmation",
            condition: "there is removal but original URL does not contain confirmation-person-removed"
        },
        {
            removal: {
                removePerson: constants.YES,
                userEmail: companyAssociations.items[0].userEmail,
                companyNumber: companyAssociations.items[0].companyNumber
            },
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl + constants.CONFIRMATION_PERSON_REMOVED_URL,
            viewData: {
                removedPerson: companyAssociations.items[0].userEmail,
                changeCompanyAuthCodeUrl: constants.CHANGE_COMPANY_AUTH_CODE_URL
            },
            returnInfo: "basic view data with removal confirmation",
            condition: "there is removal that does not contain user name but user email, and original URL contain confirmation-person-removed"
        },
        {
            removal: {
                removePerson: constants.YES,
                userEmail: companyAssociations.items[0].userEmail,
                userName: "John Smith",
                companyNumber: companyAssociations.items[0].companyNumber
            },
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl + constants.CONFIRMATION_PERSON_REMOVED_URL,
            viewData: {
                removedPerson: "John Smith",
                changeCompanyAuthCodeUrl: constants.CHANGE_COMPANY_AUTH_CODE_URL
            },
            returnInfo: "basic view data with removal confirmation",
            condition: "there is removal that contain user name but user email, and original URL contain confirmation-person-removed"
        }
    ])("should return $returnInfo if $condition",
        async ({
            removal,
            companyAssociations,
            isValidPageNumber,
            originalUrl,
            viewData
        }) => {
            // Given
            const companyNumber = companyAssociations.items[0].companyNumber;
            const lang = "en";
            const page = "1";
            const pageNumber = 1;
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: { page },
                params: { companyNumber },
                originalUrl
            });
            stringToPositiveIntegerSpy.mockReturnValue(pageNumber);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(
                {
                    state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                    associationId: "1234567890"
                }
            );
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const addPresenterFullUrl = `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/${companyNumber}`;
            getAddPresenterFullUrlSpy.mockReturnValue(addPresenterFullUrl);
            getExtraDataSpy
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(removal)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce("");
            getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
            validatePageNumberSpy.mockReturnValue(isValidPageNumber);
            const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;
            const modifiedOriginalUrl = originalUrl?.replace(":companyNumber", companyNumber);
            if (companyAssociations.totalPages > 1) {
                getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(modifiedOriginalUrl);
            }
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(manageAuthorisedPeopleFullUrl);
            const finalViewData = {
                templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                buttonHref: addPresenterFullUrl + constants.CLEAR_FORM_TRUE,
                cancelUrl: `${constants.LANDING_URL}/company/${companyNumber}/cancel-person/:userEmail`,
                resendEmailUrl: manageAuthorisedPeopleEmailResentFullUrl,
                removeUrl: companyAuthProtectedAuthenticationCodeRemoveFullUrl,
                matomoAddNewAuthorisedPersonGoalId: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID,
                companyAssociations,
                pageNumber: 0,
                numberOfPages: 0,
                pagination: undefined,
                cancelledPerson: "",
                showEmailResentSuccess: false,
                resentSuccessEmail: "",
                authorisedPersonSuccess: false,
                authorisedPersonEmailAddress: undefined,
                authorisedPersonCompanyName: undefined,
                restoreDigitalAuthBaseUrl: `${constants.LANDING_URL}${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}`,
                ...viewData
            };
            const emails = companyAssociations.items.map(item => item.userEmail);
            // When
            const response = await manageAuthorisedPeopleHandler.execute(req);
            // Then
            expect(getFullUrlSpy).toHaveBeenCalledTimes(4);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(page);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(2);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            expect(getExtraDataSpy).toHaveBeenCalledTimes(4);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CANCEL_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.AUTHORISED_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.RESENT_SUCCESS_EMAIL);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(7 + companyAssociations.items.length);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REFERER_URL, manageAuthorisedPeopleFullUrl);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_EMAILS_ARRAY, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE, true);
            for (const association of companyAssociations.items) {
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
            }
            expect(getCompanyAssociationsSpy).toHaveBeenCalledTimes(1);
            expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, pageNumber - 1);
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, companyAssociations.totalPages);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
            expect(response).toEqual(finalViewData);
        });

    test.each([
        {
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl,
            authorisedPerson: {
                authorisedPersonCompanyName: companyAssociations.items[0].userEmail,
                authorisedPersonEmailAddress: companyAssociations.items[0].companyName
            },
            viewData: {},
            returnInfo: "basic view data without person added confirmation",
            condition: "there is authorised person but original URL does not contain confirmation-person-added"
        },
        {
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl + constants.CONFIRMATION_PERSON_ADDED_URL,
            authorisedPerson: {
                authorisedPersonEmailAddress: companyAssociations.items[0].userEmail,
                authorisedPersonCompanyName: companyAssociations.items[0].companyName
            },
            viewData: {
                authorisedPersonSuccess: true,
                authorisedPersonEmailAddress: companyAssociations.items[0].userEmail,
                authorisedPersonCompanyName: companyAssociations.items[0].companyName
            },
            returnInfo: "basic view data with person added confirmation",
            condition: "there is person added and original URL contain confirmation-person-added"
        }
    ])("should return $returnInfo if $condition",
        async ({
            companyAssociations,
            isValidPageNumber,
            originalUrl,
            authorisedPerson,
            viewData
        }) => {
            // Given
            const companyNumber = companyAssociations.items[0].companyNumber;
            const lang = "en";
            const page = "1";
            const pageNumber = 1;
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: { page },
                params: { companyNumber },
                originalUrl
            });
            stringToPositiveIntegerSpy.mockReturnValue(pageNumber);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(
                {
                    state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                    associationId: "1234567890"
                }
            );
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const addPresenterFullUrl = `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/${companyNumber}`;
            getAddPresenterFullUrlSpy.mockReturnValue(addPresenterFullUrl);
            getExtraDataSpy
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(authorisedPerson)
                .mockReturnValueOnce("");
            getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
            validatePageNumberSpy.mockReturnValue(isValidPageNumber);
            const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;
            const modifiedOriginalUrl = originalUrl?.replace(":companyNumber", companyNumber);
            if (companyAssociations.totalPages > 1) {
                getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(modifiedOriginalUrl);
            }
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(manageAuthorisedPeopleFullUrl);
            const finalViewData = {
                templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                buttonHref: addPresenterFullUrl + constants.CLEAR_FORM_TRUE,
                cancelUrl: `${constants.LANDING_URL}/company/${companyNumber}/cancel-person/:userEmail`,
                resendEmailUrl: manageAuthorisedPeopleEmailResentFullUrl,
                removeUrl: companyAuthProtectedAuthenticationCodeRemoveFullUrl,
                matomoAddNewAuthorisedPersonGoalId: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID,
                companyAssociations,
                pageNumber: 0,
                numberOfPages: 0,
                pagination: undefined,
                cancelledPerson: "",
                removedPerson: "",
                changeCompanyAuthCodeUrl: undefined,
                showEmailResentSuccess: false,
                resentSuccessEmail: "",
                authorisedPersonSuccess: false,
                authorisedPersonEmailAddress: undefined,
                authorisedPersonCompanyName: undefined,
                restoreDigitalAuthBaseUrl: `${constants.LANDING_URL}${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}`,
                ...viewData
            };
            const emails = companyAssociations.items.map(item => item.userEmail);
            // When
            const response = await manageAuthorisedPeopleHandler.execute(req);
            // Then
            expect(getFullUrlSpy).toHaveBeenCalledTimes(4);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(page);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(2);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            expect(getExtraDataSpy).toHaveBeenCalledTimes(4);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CANCEL_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.AUTHORISED_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.RESENT_SUCCESS_EMAIL);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(7 + companyAssociations.items.length);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REFERER_URL, manageAuthorisedPeopleFullUrl);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_EMAILS_ARRAY, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE, true);
            for (const association of companyAssociations.items) {
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
            }
            expect(getCompanyAssociationsSpy).toHaveBeenCalledTimes(1);
            expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, pageNumber - 1);
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, companyAssociations.totalPages);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
            expect(response).toEqual(finalViewData);
        });

    test.each([
        {
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl,
            resentSuccessEmail: companyAssociations.items[0].userEmail,
            viewData: {},
            returnInfo: "basic view data without resent email confirmation",
            condition: "there is resent email success but original URL does not contain authorisation-email-resent"
        },
        {
            companyAssociations: getAssociationList(companyAssociations.items, 15, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl + constants.AUTHORISATION_EMAIL_RESENT_URL,
            resentSuccessEmail: companyAssociations.items[0].userEmail,
            viewData: {
                showEmailResentSuccess: true,
                resentSuccessEmail: companyAssociations.items[0].userEmail
            },
            returnInfo: "basic view data with esent email confirmation",
            condition: "there is resent email success and original URL contain authorisation-email-resent"
        }
    ])("should return $returnInfo if $condition",
        async ({
            companyAssociations,
            isValidPageNumber,
            originalUrl,
            resentSuccessEmail,
            viewData
        }) => {
            // Given
            const companyNumber = companyAssociations.items[0].companyNumber;
            const lang = "en";
            const page = "1";
            const pageNumber = 1;
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: { page },
                params: { companyNumber },
                originalUrl
            });
            stringToPositiveIntegerSpy.mockReturnValue(pageNumber);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(
                {
                    state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                    associationId: "1234567890"
                }
            );
            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const addPresenterFullUrl = `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/${companyNumber}`;
            getAddPresenterFullUrlSpy.mockReturnValue(addPresenterFullUrl);
            getExtraDataSpy
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(resentSuccessEmail);
            getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
            validatePageNumberSpy.mockReturnValue(isValidPageNumber);
            const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;
            const modifiedOriginalUrl = originalUrl?.replace(":companyNumber", companyNumber);
            if (companyAssociations.totalPages > 1) {
                getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(modifiedOriginalUrl);
            }
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(manageAuthorisedPeopleFullUrl);
            const finalViewData = {
                templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                buttonHref: addPresenterFullUrl + constants.CLEAR_FORM_TRUE,
                cancelUrl: `${constants.LANDING_URL}/company/${companyNumber}/cancel-person/:userEmail`,
                resendEmailUrl: manageAuthorisedPeopleEmailResentFullUrl,
                removeUrl: companyAuthProtectedAuthenticationCodeRemoveFullUrl,
                matomoAddNewAuthorisedPersonGoalId: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID,
                companyAssociations,
                pageNumber: 0,
                numberOfPages: 0,
                pagination: undefined,
                cancelledPerson: "",
                removedPerson: "",
                changeCompanyAuthCodeUrl: undefined,
                showEmailResentSuccess: false,
                resentSuccessEmail: "",
                authorisedPersonSuccess: false,
                authorisedPersonEmailAddress: undefined,
                authorisedPersonCompanyName: undefined,
                restoreDigitalAuthBaseUrl: `${constants.LANDING_URL}${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}`,
                ...viewData
            };
            const emails = companyAssociations.items.map(item => item.userEmail);
            // When
            const response = await manageAuthorisedPeopleHandler.execute(req);
            // Then
            expect(getFullUrlSpy).toHaveBeenCalledTimes(4);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(page);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(2);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            expect(getExtraDataSpy).toHaveBeenCalledTimes(4);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CANCEL_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.AUTHORISED_PERSON);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.RESENT_SUCCESS_EMAIL);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(7 + companyAssociations.items.length);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REFERER_URL, manageAuthorisedPeopleFullUrl);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_EMAILS_ARRAY, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE, true);
            for (const association of companyAssociations.items) {
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
            }
            expect(getCompanyAssociationsSpy).toHaveBeenCalledTimes(1);
            expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, pageNumber - 1);
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, companyAssociations.totalPages);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);
            expect(response).toEqual(finalViewData);
        });

    test.each([
        { state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER },
        { state: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER },
        { state: AssociationState.COMPANY_WAS_ASSOCIATED_WITH_USER }
    ])("should throw an exception when association state is $state", async ({ state }) => {
        // Given
        const companyNumber = companyAssociations.items[0].companyNumber;
        const lang = "en";
        const page = "1";
        const req: Request = mockParametrisedRequest({
            session: new Session(),
            lang,
            query: { page },
            params: { companyNumber }
        });
        const isAssociated = {
            state,
            associationId: "1234567890"
        };
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
        const errorText = `${ManageAuthorisedPeopleHandler.name} preventUnauthorisedAccess: Unauthorised, redirecting to your companies`;
        const expectedError = createError(StatusCodes.FORBIDDEN, errorText, { redirctToYourCompanies: true });
        // Then
        await expect(manageAuthorisedPeopleHandler.execute(req)).rejects.toThrow(expectedError);
    });
});
