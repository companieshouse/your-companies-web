import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as validation from "../../../../../../src/lib/validation/generic";
import * as constants from "../../../../../../src/constants";
import { YourCompaniesHandler } from "../../../../../../src/routers/handlers/yourCompanies/yourCompaniesHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as associationsService from "../../../../../../src/services/associationsService";
import { emptyAssociations, userAssociations } from "../../../../../mocks/associations.mock";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { mockInvitationList } from "../../../../../mocks/invitations.mock";
import * as paginationHelper from "../../../../../../src/lib/helpers/buildPaginationHelper";
import { AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";

jest.mock("../../../../../../src/lib/Logger");

const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getUserAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
const validatePageNumberSpy: jest.SpyInstance = jest.spyOn(validation, "validatePageNumber");
const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
const getInstanceSpy: jest.SpyInstance = jest.spyOn(i18nCh, "getInstance");
const getResourceBundleMock = jest.fn();
const validateCompanyNumberSearchStringSpy: jest.SpyInstance = jest.spyOn(validation, "validateCompanyNumberSearchString");
const stringToPositiveIntegerSpy: jest.SpyInstance = jest.spyOn(paginationHelper, "stringToPositiveInteger");
const getSearchQuerySpy: jest.SpyInstance = jest.spyOn(paginationHelper, "getSearchQuery");
const buildPaginationElementSpy: jest.SpyInstance = jest.spyOn(paginationHelper, "buildPaginationElement");
const setLangForPaginationSpy: jest.SpyInstance = jest.spyOn(paginationHelper, "setLangForPagination");
const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");

describe("YourCompaniesHandler", () => {
    let yourCompaniesHandler: YourCompaniesHandler;
    const addCompanyUrl = `${constants.LANDING_URL}${constants.ADD_COMPANY_URL}`;
    const viewInvitationsPageUrl = `${constants.LANDING_URL}${constants.COMPANY_INVITATIONS_URL}`;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        getFullUrlSpy
            .mockReturnValueOnce(addCompanyUrl)
            .mockReturnValueOnce(viewInvitationsPageUrl);
        yourCompaniesHandler = new YourCompaniesHandler();
    });

    test.each([
        {
            query: {
                search: undefined,
                page: undefined
            },
            pageNumber: emptyAssociations.pageNumber,
            confirmedUserAssociations: emptyAssociations,
            isValidPageNumber: true,
            viewData: {
                numberOfInvitations: mockInvitationList.totalResults,
                associationData: [],
                numOfMatches: 0,
                displaySearchForm: false,
                userHasCompanies: "",
                removeCompanyUrl: "",
                viewAndManageUrl: "",
                showNumOfMatches: false,
                pagination: undefined
            },
            return: "basic view data",
            condition: "user has no confirmed associations and has invitations"
        },
        {
            query: {
                search: "validSearchString",
                page: "1"
            },
            pageNumber: userAssociations.pageNumber,
            confirmedUserAssociations: userAssociations,
            isValidPageNumber: true,
            viewData: {
                numberOfInvitations: mockInvitationList.totalResults,
                associationData: [{
                    company_name: userAssociations.items[0].companyName,
                    company_number: userAssociations.items[0].companyNumber,
                    company_status: userAssociations.items[0].companyStatus
                },
                {
                    company_name: userAssociations.items[1].companyName,
                    company_number: userAssociations.items[1].companyNumber,
                    company_status: userAssociations.items[1].companyStatus
                }],
                numOfMatches: userAssociations.totalResults,
                numberOfPages: userAssociations.totalPages,
                displaySearchForm: true,
                userHasCompanies: constants.TRUE,
                removeCompanyUrl: undefined,
                viewAndManageUrl: undefined,
                showNumOfMatches: true,
                pagination: {
                    previous: { href: "href" },
                    items: []
                }
            },
            searchQuery: "&search=validSearchString",
            return: "basic view data with empty pagination object",
            condition: "user has confirmed associations and has invitations"
        },
        {
            query: {
                search: "invalidSearchString",
                page: undefined
            },
            pageNumber: emptyAssociations.pageNumber,
            confirmedUserAssociations: emptyAssociations,
            isValidPageNumber: true,
            viewData: {
                numberOfInvitations: mockInvitationList.totalResults,
                associationData: [],
                numOfMatches: 0,
                displaySearchForm: true,
                userHasCompanies: constants.TRUE,
                removeCompanyUrl: "",
                viewAndManageUrl: "",
                showNumOfMatches: false,
                pagination: undefined
            },
            errors: {
                search: {
                    text: constants.COMPANY_NUMBER_MUST_ONLY_INCLUDE
                }
            },
            return: "view data containing search error message",
            condition: "a search string exists, but is not valid"
        },
        {
            query: {
                search: "validSearchString",
                page: undefined
            },
            pageNumber: emptyAssociations.pageNumber,
            confirmedUserAssociations: emptyAssociations,
            isValidPageNumber: true,
            viewData: {
                numberOfInvitations: mockInvitationList.totalResults,
                associationData: [],
                numOfMatches: 0,
                displaySearchForm: true,
                userHasCompanies: constants.TRUE,
                removeCompanyUrl: "",
                viewAndManageUrl: "",
                showNumOfMatches: true,
                pagination: undefined
            },
            return: "view data without search error message",
            condition: "a search string exists, and is valid"
        },
        {
            query: {
                search: "invalidSearchString",
                page: undefined
            },
            pageNumber: emptyAssociations.pageNumber,
            confirmedUserAssociations: emptyAssociations,
            isValidPageNumber: false,
            viewData: {
                numberOfInvitations: mockInvitationList.totalResults,
                associationData: [],
                numOfMatches: 0,
                displaySearchForm: true,
                userHasCompanies: constants.TRUE,
                removeCompanyUrl: "",
                viewAndManageUrl: "",
                showNumOfMatches: false,
                pagination: undefined
            },
            errors: {
                search: {
                    text: constants.COMPANY_NUMBER_MUST_ONLY_INCLUDE
                }
            },
            return: "expected view data",
            condition: "isValidPageNumber is false and there are error messages"
        },
        {
            query: {
                search: "validSearchString",
                page: undefined
            },
            pageNumber: emptyAssociations.pageNumber,
            confirmedUserAssociations: emptyAssociations,
            isValidPageNumber: false,
            viewData: {
                numberOfInvitations: mockInvitationList.totalResults,
                associationData: [],
                numOfMatches: 0,
                displaySearchForm: true,
                userHasCompanies: constants.TRUE,
                removeCompanyUrl: "",
                viewAndManageUrl: "",
                showNumOfMatches: true,
                pagination: undefined
            },
            return: "expected view data",
            condition: "invalidPageNumber is false and there are no error messages"
        }
    ])("should return $return when $condition",
        async ({
            query, pageNumber, confirmedUserAssociations, isValidPageNumber, viewData, errors, searchQuery
        }) => {

            // Given
            const lang = {
                0: "en",
                1: {}
            };
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query
            });
            const i18nChInstance = {
                getResourceBundle: getResourceBundleMock
            };

            const expectedViewData = {
                templateName: constants.YOUR_COMPANIES_PAGE,
                buttonHref: addCompanyUrl + constants.CLEAR_FORM_TRUE,
                lang,
                viewInvitationsPageUrl,
                cancelSearchHref: constants.LANDING_URL,
                matomoAddCompanyGoalId: constants.MATOMO_ADD_COMPANY_GOAL_ID,
                search: query.search,
                errors: errors,
                pageNumber,
                numberOfPages: 0,
                requestAuthenticationCodeUrl: "",
                ...viewData
            };
            getUserAssociationsSpy.mockReturnValue(confirmedUserAssociations);
            validatePageNumberSpy.mockReturnValue(isValidPageNumber);
            getTranslationsForViewSpy.mockReturnValue(lang);
            getInstanceSpy.mockReturnValue(i18nChInstance);
            getInvitationsSpy.mockReturnValue(mockInvitationList);
            stringToPositiveIntegerSpy.mockReturnValueOnce(pageNumber);
            getResourceBundleMock.mockReturnValue({});
            if (query.search === "invalidSearchString") {
                validateCompanyNumberSearchStringSpy.mockReturnValue(false);
            } else {
                validateCompanyNumberSearchStringSpy.mockReturnValue(true);
            }
            getSearchQuerySpy.mockReturnValue(`&search=${query.search}`);
            buildPaginationElementSpy.mockReturnValue(viewData.pagination);

            // When
            const response = await yourCompaniesHandler.execute(req);

            // Then
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(query.page);
            if (query.search) {
                expect(validateCompanyNumberSearchStringSpy).toHaveBeenCalledTimes(1);
                expect(validateCompanyNumberSearchStringSpy).toHaveBeenCalledWith(query.search);
            }

            let getUserAssociationsCounter = 1;
            expect(getUserAssociationsSpy).toHaveBeenCalledWith(req, [AssociationStatus.CONFIRMED], errors ? undefined : query.search, pageNumber - 1);
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, confirmedUserAssociations.totalPages);

            if (!isValidPageNumber) {
                getUserAssociationsCounter = 2;
                expect(getUserAssociationsSpy).toHaveBeenCalledWith(req, [AssociationStatus.CONFIRMED], errors ? undefined : query.search, pageNumber - 1);
            }

            expect(getInvitationsSpy).toHaveBeenCalledTimes(1);
            expect(getInvitationsSpy).toHaveBeenCalledWith(req);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(9);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_URL_EXTRA);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.USER_EMAILS_ARRAY);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CURRENT_COMPANY_NUM);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.REMOVE_COMPANY_URL_EXTRA);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.LAST_REMOVED_COMPANY_NAME);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.LAST_REMOVED_COMPANY_NUMBER);
            expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.YOU_MUST_SELECT_AN_OPTION);
            expect(getResourceBundleMock).toHaveBeenCalled;
            expect(getResourceBundleMock).toHaveBeenCalledWith(lang, constants.COMPANY_STATUS);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.YOUR_COMPANIES_PAGE);

            if (confirmedUserAssociations.totalResults > 0) {
                expect(getSearchQuerySpy).toHaveBeenCalledTimes(1);
                expect(getSearchQuerySpy).toHaveBeenCalledWith(query.search);
                expect(buildPaginationElementSpy).toHaveBeenCalledTimes(1);
                expect(buildPaginationElementSpy).toHaveBeenCalledWith(pageNumber, confirmedUserAssociations.totalPages, constants.LANDING_URL, searchQuery);
                expect(setLangForPaginationSpy).toHaveBeenCalledTimes(1);
                expect(setLangForPaginationSpy).toHaveBeenCalledWith(viewData.pagination, lang);
            }

            let getFullUrlCounter = 2;
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.ADD_COMPANY_URL);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_INVITATIONS_URL);

            if (confirmedUserAssociations.totalResults > 0 && Array.isArray(confirmedUserAssociations.items)) {
                getFullUrlCounter = 4;
                expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL);
                expect(getFullUrlSpy).toHaveBeenCalledWith(constants.REMOVE_COMPANY_URL);
            }

            expect(getUserAssociationsSpy).toHaveBeenCalledTimes(getUserAssociationsCounter);
            expect(getFullUrlSpy).toHaveBeenCalledTimes(getFullUrlCounter);
            expect(response).toEqual(expectedViewData);
        });

});
