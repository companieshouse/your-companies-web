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
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const getSearchStringEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getSearchStringEmail");
const getCompanyNameFromCollectionSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getCompanyNameFromCollection");
const setCompanyNameInCollectionSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setCompanyNameInCollection");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const validatePageNumberSpy: jest.SpyInstance = jest.spyOn(validator, "validatePageNumber");

describe("ManageAuthorisedPeopleHandler", () => {
    let manageAuthorisedPeopleHandler: ManageAuthorisedPeopleHandler;
    const manageAuthorisedPeopleEmailResentFullUrl = `${constants.LANDING_URL}${constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL}`;
    const companyAuthProtectedAuthenticationCodeRemoveFullUrl = `${constants.LANDING_URL}${constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL}`;
    const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/:${constants.COMPANY_NUMBER}`;
    const sendEmailInvitationToBeDigitallyAuthorisedBaseUrl = `${constants.LANDING_URL}${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}`;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        getFullUrlSpy
            .mockReturnValueOnce(manageAuthorisedPeopleEmailResentFullUrl)
            .mockReturnValueOnce(companyAuthProtectedAuthenticationCodeRemoveFullUrl)
            .mockReturnValueOnce(sendEmailInvitationToBeDigitallyAuthorisedBaseUrl)
            .mockReturnValueOnce(manageAuthorisedPeopleFullUrl.replace(":companyNumber", "NI038379"));

        manageAuthorisedPeopleHandler = new ManageAuthorisedPeopleHandler();
    });

    test.each([
        {
            page: "1",
            pageNumber: 1,
            companyAssociations: getAssociationList(companyAssociations.items, constants.ITEMS_PER_PAGE, 0, companyAssociations.items.length, 1),
            isValidPageNumber: true,
            originalUrl: manageAuthorisedPeopleFullUrl,
            pagination: undefined,
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
            companyAssociations: getAssociationList(companyAssociations.items, constants.ITEMS_PER_PAGE, 0, companyAssociations.items.length, 1),
            isValidPageNumber: false,
            viewData: {
                pageNumber: 0,
                numberOfPages: 0
            },
            returnInfo: "basic view data without pagination",
            condition: "there is no removal or email resent triggered and not enough associations for pagination but the page number is invalid"
        },
        {
            page: "2",
            pageNumber: 2,
            companyAssociations: getAssociationList(companyAssociations.items, constants.ITEMS_PER_PAGE, 1, companyAssociations.items.length + constants.ITEMS_PER_PAGE, 2),
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
            condition: "there is no removal or email resent triggered but there is enough associations for pagination"
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
            getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
            validatePageNumberSpy.mockReturnValue(isValidPageNumber);
            const manageAuthorisedPeopleFullUrl = `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;
            const modifiedOriginalUrl = originalUrl?.replace(":companyNumber", companyNumber);
            if (companyAssociations.totalPages > 1) {
                getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(modifiedOriginalUrl);
            }
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValueOnce(manageAuthorisedPeopleFullUrl)
                .mockReturnValueOnce(manageAuthorisedPeopleFullUrl);
            buildPaginationElementSpy.mockReturnValue(pagination);
            const finalViewData = {
                templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: translations,
                buttonHref: addPresenterFullUrl + constants.CLEAR_FORM_TRUE,
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
                notRestoredPerson: "",
                restoreDigitalAuthBaseUrl: `${constants.LANDING_URL}${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}`,
                cancelSearchHref: "/your-companies/manage-authorised-people/NI038379?cancelSearch",
                companyName: "THE POLISH BREWERY",
                companyNumber: "NI038379",
                searchEmail: null,
                validSearch: false,
                manageAuthorisedPeopleUrl: manageAuthorisedPeopleFullUrl,
                ...viewData
            };
            const emails = companyAssociations.items.map(item => item.userEmail);
            const associationIds = companyAssociations.items.map(item => item.id);
            // When
            const response = await manageAuthorisedPeopleHandler.execute(req);
            // Then
            expect(getFullUrlSpy).toHaveBeenCalledTimes(4);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(page);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_PAGE_ERRORS);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledTimes(1);
            expect(isOrWasCompanyAssociatedWithUserSpy).toHaveBeenCalledWith(req, companyNumber);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getAddPresenterFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            let getCompanyAssociationsCounter = 1;
            expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, pageNumber - 1, constants.ITEMS_PER_PAGE);
            if (!isValidPageNumber) {
                expect(getCompanyAssociationsSpy).toHaveBeenCalledWith(req, companyNumber, undefined, undefined, 0, constants.ITEMS_PER_PAGE);
                getCompanyAssociationsCounter = ++getCompanyAssociationsCounter;
            }
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, companyAssociations.totalPages);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledWith(companyNumber);
            if (companyAssociations.totalPages > 1) {
                expect(buildPaginationElementSpy).toHaveBeenCalledTimes(1);
                expect(buildPaginationElementSpy).toHaveBeenCalledWith(isValidPageNumber ? pageNumber : 1, companyAssociations.totalPages, modifiedOriginalUrl, "");
                expect(setLangForPaginationSpy).toHaveBeenCalledTimes(1);
                expect(setLangForPaginationSpy).toHaveBeenCalledWith(pagination, translations);
            }
            expect(setExtraDataSpy).toHaveBeenCalledTimes(8 + companyAssociations.items.length);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REFERER_URL, manageAuthorisedPeopleFullUrl);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER, companyNumber);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_EMAILS_ARRAY, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL, emails);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE, true);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID, associationIds);
            for (const association of companyAssociations.items) {
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
            }
            expect(getCompanyAssociationsSpy).toHaveBeenCalledTimes(getCompanyAssociationsCounter);
            expect(getManageAuthorisedPeopleFullUrlSpy).toHaveBeenCalledTimes(2);
            expect(getSearchStringEmailSpy).toHaveBeenCalledTimes(1);
            expect(getSearchStringEmailSpy).toHaveBeenCalledWith(expect.any(Session), companyNumber);
            expect(getCompanyNameFromCollectionSpy).toHaveBeenCalledTimes(0);
            expect(setCompanyNameInCollectionSpy).toHaveBeenCalledTimes(1);
            expect(setCompanyNameInCollectionSpy).toHaveBeenCalledWith(expect.any(Session), companyAssociations?.items[0]?.companyName, companyNumber);
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
