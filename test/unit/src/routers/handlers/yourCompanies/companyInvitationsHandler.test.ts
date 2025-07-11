import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../../../src/constants";
import * as buildPaginationHelper from "../../../../../../src/lib/helpers/buildPaginationHelper";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as validator from "../../../../../../src/lib/validation/generic";
import { CompanyInvitationsHandler } from "../../../../../../src/routers/handlers/yourCompanies/companyInvitationsHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { getMockInvitationList, getPaginatedMockInvitationList, mockInvitations } from "../../../../../mocks/invitations.mock";
import { AssociationStatus } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { userAssociations } from "../../../../../mocks/associations.mock";

const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const stringToPositiveIntegerSpy: jest.SpyInstance = jest.spyOn(buildPaginationHelper, "stringToPositiveInteger");
const buildPaginationElementSpy: jest.SpyInstance = jest.spyOn(buildPaginationHelper, "buildPaginationElement");
const setLangForPaginationSpy: jest.SpyInstance = jest.spyOn(buildPaginationHelper, "setLangForPagination");
const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
const getUserAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
const validatePageNumberSpy: jest.SpyInstance = jest.spyOn(validator, "validatePageNumber");
const getCompanyInvitationsAcceptFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getCompanyInvitationsAcceptFullUrl");
const getCompanyInvitationsDeclineFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getCompanyInvitationsDeclineFullUrl");
const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");

describe("CompanyInvitationsHandler", () => {
    let companyInvitationsHandler: CompanyInvitationsHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        companyInvitationsHandler = new CompanyInvitationsHandler();
    });

    test.each([
        {
            page: "1",
            pageNumber: 1,
            userInvites: getMockInvitationList([]),
            isPageNumberValid: true,
            associations: userAssociations,
            viewData: {
                backLinkHref: "/your-companies",
                lang: {
                    accept: "accept",
                    decline: "decline"
                },
                numberOfPages: 0,
                pageNumber: 0,
                pagination: undefined,
                rowsData: [],
                templateName: "company-invitations"
            },
            contentInfo: "without invitations",
            condition: "there are no invitations"
        },
        {
            page: "123",
            pageNumber: 123,
            userInvites: getMockInvitationList([]),
            isPageNumberValid: false,
            associations: userAssociations,
            viewData: {
                backLinkHref: "/your-companies",
                lang: {
                    accept: "accept",
                    decline: "decline"
                },
                numberOfPages: 0,
                pageNumber: 0,
                pagination: undefined,
                rowsData: [],
                templateName: "company-invitations"
            },
            contentInfo: "without invitations",
            condition: "there are no invitations and requsted page is invalid"
        },
        {
            page: "1",
            pageNumber: 1,
            userInvites: getMockInvitationList(mockInvitations),
            isPageNumberValid: true,
            associations: userAssociations,
            viewData: {
                backLinkHref: "/your-companies",
                lang: {
                    accept: "accept",
                    decline: "decline"
                },
                numberOfPages: 0,
                pageNumber: 0,
                pagination: undefined,
                rowsData: [
                    [
                        { text: "THE POLISH BREWERY" },
                        { text: "NI038379" },
                        { text: "bob@bob.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/1234567890?companyName=THE+POLISH+BREWERY\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefinedTHE POLISH BREWERY\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/1234567890?companyName=THE+POLISH+BREWERY\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefinedTHE POLISH BREWERY\" data-event-id=\"decline-invite\">decline</a>" }
                    ],
                    [
                        { text: "BRITISH AIRWAYS PLC" },
                        { text: "01777777" },
                        { text: "bob@bob.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/2345678901?companyName=BRITISH+AIRWAYS+PLC\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefinedBRITISH AIRWAYS PLC\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/2345678901?companyName=BRITISH+AIRWAYS+PLC\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefinedBRITISH AIRWAYS PLC\" data-event-id=\"decline-invite\">decline</a>" }
                    ],
                    [
                        { text: "" },
                        { text: "" },
                        { text: "bob@bob.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/44345677554?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/44345677554?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"decline-invite\">decline</a>" }
                    ],
                    [
                        { text: "" },
                        { text: "" },
                        { text: "another.email@acme.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/234322344?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/234322344?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"decline-invite\">decline</a>" }
                    ],
                    [
                        { text: "" },
                        { text: "" },
                        { text: "bob@bob.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/6654463562412?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/6654463562412?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"decline-invite\">decline</a>" }
                    ]
                ],
                templateName: "company-invitations"
            },
            contentInfo: "without pagination",
            condition: "there is only one page of invitations"
        },
        {
            page: "1",
            pageNumber: 1,
            userInvites: getPaginatedMockInvitationList(mockInvitations),
            isPageNumberValid: true,
            associations: userAssociations,
            viewData: {
                backLinkHref: "/your-companies",
                lang: {
                    accept: "accept",
                    decline: "decline"
                },
                numberOfPages: 4,
                pageNumber: 1,
                pagination: {
                    previous: { href: "href" },
                    items: []
                },
                rowsData: [
                    [
                        { text: "THE POLISH BREWERY" },
                        { text: "NI038379" },
                        { text: "bob@bob.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/1234567890?companyName=THE+POLISH+BREWERY\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefinedTHE POLISH BREWERY\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/1234567890?companyName=THE+POLISH+BREWERY\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefinedTHE POLISH BREWERY\" data-event-id=\"decline-invite\">decline</a>" }
                    ],
                    [
                        { text: "BRITISH AIRWAYS PLC" },
                        { text: "01777777" },
                        { text: "bob@bob.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/2345678901?companyName=BRITISH+AIRWAYS+PLC\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefinedBRITISH AIRWAYS PLC\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/2345678901?companyName=BRITISH+AIRWAYS+PLC\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefinedBRITISH AIRWAYS PLC\" data-event-id=\"decline-invite\">decline</a>" }
                    ],
                    [
                        { text: "" },
                        { text: "" },
                        { text: "bob@bob.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/44345677554?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/44345677554?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"decline-invite\">decline</a>" }
                    ],
                    [
                        { text: "" },
                        { text: "" },
                        { text: "another.email@acme.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/234322344?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/234322344?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"decline-invite\">decline</a>" }
                    ],
                    [
                        { text: "" },
                        { text: "" },
                        { text: "bob@bob.com" },
                        { html: "<a href=\"/your-companies/company-invitations-accept/6654463562412?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"accept-invite\">accept</a>" },
                        { html: "<a href=\"/your-companies/company-invitations-decline/6654463562412?companyName=\" class=\"govuk-link govuk-link--no-visited-state\" aria-label=\"undefined\" data-event-id=\"decline-invite\">decline</a>" }
                    ]
                ],
                templateName: "company-invitations"
            },
            contentInfo: "with pagination",
            condition: "there is more than one page of invitations"
        }
    ])("should return view data $contentInfo if $condition",
        async ({ page, pageNumber, userInvites, isPageNumberValid, associations, viewData }) => {
            // Given
            const lang = "en";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                query: { page }
            });
            const translations = {
                accept: "accept",
                decline: "decline"
            };
            getTranslationsForViewSpy.mockReturnValue(translations);
            stringToPositiveIntegerSpy.mockReturnValue(pageNumber);
            getInvitationsSpy.mockReturnValue(userInvites);
            validatePageNumberSpy.mockReturnValue(isPageNumberValid);
            getUserAssociationsSpy.mockReturnValue(associations);
            for (const invite of userInvites.items) {
                getCompanyInvitationsAcceptFullUrlSpy.mockReturnValueOnce(`${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/${invite.associationId}`);
                getCompanyInvitationsDeclineFullUrlSpy.mockReturnValueOnce(`${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_DECLINE_PAGE}/${invite.associationId}`);
            }
            const urlPrefix = `${constants.LANDING_URL}${constants.COMPANY_INVITATIONS_URL}`;
            getFullUrlSpy.mockReturnValue(urlPrefix);
            if (viewData.numberOfPages > 1) {
                buildPaginationElementSpy.mockReturnValue(viewData.pagination);
            }
            // When
            const response = await companyInvitationsHandler.execute(req);
            // Then
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.COMPANY_INVITATIONS_PAGE);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledTimes(1);
            expect(stringToPositiveIntegerSpy).toHaveBeenCalledWith(page);
            let getInvitationsCallCount = 1;
            expect(getInvitationsSpy).toHaveBeenCalledWith(req, pageNumber - 1);
            if (!isPageNumberValid) {
                getInvitationsCallCount = ++getInvitationsCallCount;
                expect(getInvitationsSpy).toHaveBeenCalledWith(req, 0);
            }
            expect(getInvitationsSpy).toHaveBeenCalledTimes(getInvitationsCallCount);
            expect(validatePageNumberSpy).toHaveBeenCalledTimes(1);
            expect(validatePageNumberSpy).toHaveBeenCalledWith(pageNumber, userInvites.totalPages);
            expect(getUserAssociationsSpy).toHaveBeenCalledTimes(1);
            expect(getUserAssociationsSpy).toHaveBeenCalledWith(req, [AssociationStatus.AWAITING_APPROVAL], undefined, undefined, constants.INVITATIONS_PER_PAGE);
            expect(getCompanyInvitationsAcceptFullUrlSpy).toHaveBeenCalledTimes(userInvites.items.length);
            expect(getCompanyInvitationsDeclineFullUrlSpy).toHaveBeenCalledTimes(userInvites.items.length);
            for (const invite of userInvites.items) {
                expect(getCompanyInvitationsAcceptFullUrlSpy).toHaveBeenCalledWith(invite.associationId);
                expect(getCompanyInvitationsDeclineFullUrlSpy).toHaveBeenCalledWith(invite.associationId);
            }
            if (viewData.numberOfPages > 1) {
                expect(getFullUrlSpy).toHaveBeenCalledTimes(1);
                expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_INVITATIONS_URL);
                expect(buildPaginationElementSpy).toHaveBeenCalledTimes(1);
                expect(buildPaginationElementSpy).toHaveBeenCalledWith(pageNumber, userInvites.totalPages, urlPrefix, "");
                expect(setLangForPaginationSpy).toHaveBeenCalledTimes(1);
                expect(setLangForPaginationSpy).toHaveBeenCalledWith(viewData.pagination, translations);
            }

            expect(response).toEqual(viewData);
        });
});
