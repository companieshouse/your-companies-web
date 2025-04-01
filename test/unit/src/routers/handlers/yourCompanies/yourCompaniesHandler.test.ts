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
import { userAssociations } from "../../../../../mocks/associations.mock";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { mockInvitationList } from "../../../../../mocks/invitations.mock";
import * as paginationHelper from "../../../../../../src/lib/helpers/buildPaginationHelper";
import { when } from "jest-when";

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

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        yourCompaniesHandler = new YourCompaniesHandler();
    });

    const SearchStatus = {
        VALID_SEARCH: "COMP123",
        INVALID_SEARCH: "invalidSearch"
    };

    test.each([
        {
            getExtraDataKeys: [],
            search: "",
            pageNumber: 1,
            errorMassage: {
                search: {
                    text: constants.COMPANY_NUMBER_MUST_ONLY_INCLUDE
                }
            },
            viewData: {
                search: SearchStatus.INVALID_SEARCH,
                errors: {
                    search: {
                        text: constants.COMPANY_NUMBER_MUST_ONLY_INCLUDE
                    }
                }
            },
            return: "view data with search error message",
            condition: "there are errors with the search string"
        },
        {
            getExtraDataKeys: [],
            search: "COMP123",
            errorMassage: [],
            pageNumber: 1,
            viewData: {
                search: SearchStatus.VALID_SEARCH
            },
            return: "view data without errors",
            condition: "the search string is valid"
        },
        {
            getExtraDataKeys: [],
            search: "",
            viewData: {
                search: SearchStatus.VALID_SEARCH
            },
            errorMassage: [],
            pageNumber: 0,
            return: "pageNumber = 1 and getUserAssociations triggers twice",
            condition: "the pageNumber value is 0"
        }
    ])("should return $return when $condition",
        async ({ getExtraDataKeys, errorMassage, pageNumber, viewData }) => {

            // Given
            const lang = "en";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: viewData
            });
            const i18nChInstance = {
                getResourceBundle: getResourceBundleMock
            };

            const associationsArray = userAssociations.items.map(item => ({
                company_name: item.companyName,
                company_number: item.companyNumber,
                company_status: item.companyStatus
            }));

            // console.log(associationsArray);

            const expectedViewData = {
                templateName: constants.CANCEL_PERSON_PAGE,
                lang: translations,
                buttonHref: `${constants.LANDING_URL}${constants.ADD_COMPANY_URL}`,
                // associationData: associationsArray,
                ...viewData
            };
            getUserAssociationsSpy.mockReturnValue(userAssociations);
            validatePageNumberSpy.mockReturnValue(true);
            getInstanceSpy.mockReturnValue(i18nChInstance);
            getInvitationsSpy.mockReturnValue(mockInvitationList);
            when(getFullUrlSpy).calledWith(constants.ADD_COMPANY_URL).mockReturnValue(`${constants.LANDING_URL}${constants.ADD_COMPANY_URL}${constants.CLEAR_FORM_TRUE}`);
            when(getFullUrlSpy).calledWith(constants.COMPANY_INVITATIONS_URL).mockReturnValue(`${constants.LANDING_URL}${constants.COMPANY_INVITATIONS_URL}`);
            // when(getFullUrlSpy).calledWith(constants.MANAGE_AUTHORISED_PEOPLE_URL).mockReturnValue(`${constants.LANDING_URL}${constants.MANAGE_AUTHORISED_PEOPLE_URL}`);
            // when(getFullUrlSpy).calledWith(constants.REMOVE_COMPANY_URL).mockReturnValue(`${constants.LANDING_URL}${constants.REMOVE_COMPANY_URL}`);

            if (viewData.search === SearchStatus.VALID_SEARCH) {
                validateCompanyNumberSearchStringSpy.mockReturnValue(true);
            } else {
                validateCompanyNumberSearchStringSpy.mockReturnValue(false);
            }

            if (pageNumber === 0) {
                validatePageNumberSpy.mockReturnValue(false);
            } else {
                validatePageNumberSpy.mockReturnValue(true);
            }

            getResourceBundleMock.mockReturnValue({});

            // When
            const response = await yourCompaniesHandler.execute(req);

            // Then
            expect(validateCompanyNumberSearchStringSpy).toHaveBeenCalledTimes(1);
            expect(deleteExtraDataSpy).toHaveBeenCalledTimes(9);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            if (pageNumber === 0) {
                expect(getUserAssociationsSpy).toHaveBeenCalledTimes(2);
            } else {
                expect(getUserAssociationsSpy).toHaveBeenCalledTimes(1);
            }
            expect(getInvitationsSpy).toHaveBeenCalledTimes(1);
            expect(getInstanceSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getResourceBundleMock).toHaveBeenCalled;
            expect(getResourceBundleMock).toHaveBeenCalledWith(lang, constants.COMPANY_STATUS);

            // WITHIN AN IF STATEMENT
            expect(getSearchQuerySpy).toHaveBeenCalledTimes(1);
            expect(buildPaginationElementSpy).toHaveBeenCalledTimes(1);
            expect(setLangForPaginationSpy).toHaveBeenCalledTimes(1);

            // expect(getFullUrlSpy).toHaveBeenCalledTimes(4);
            // expect(response).toEqual(expectedViewData);
            // console.log(response);
        });

});
