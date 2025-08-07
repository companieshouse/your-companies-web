import { Request, Response } from "express";
import * as constants from "../../../../src/constants";
import { navigationMiddleware } from "../../../../src/middleware/navigation.middleware";
import { mockParametrisedRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { when } from "jest-when";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../src/lib/utils/sessionUtils");

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

const session = new Session();
const res: Response = mockResponse();
const next = jest.fn();

describe("navigationMiddleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        {
            referer: "https://chc.local/your-companies/",
            routePattern: constants.LANDING_URL,
            path: "/your-companies",
            params: {}
        },
        {
            referer: undefined,
            routePattern: constants.LANDING_URL,
            path: "/your-companies",
            params: {}
        },
        {
            referer: "https://chc.local/your-companies/confirmation-authorisation-email-resent",
            routePattern: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL,
            path: "/confirmation-authorisation-email-resent"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people-email-resent/test@example.com",
            routePattern: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL,
            path: "/confirmation-authorisation-email-resent"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL,
            path: "/confirmation-authorisation-email-resent"
        },
        {
            referer: "https://chc.local/your-companies/confirmation-person-added",
            routePattern: constants.CONFIRMATION_PERSON_ADDED_URL,
            path: "/confirmation-person-added"
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.CONFIRMATION_PERSON_ADDED_URL,
            path: "/confirmation-person-added",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-person-removed",
            routePattern: constants.CONFIRMATION_PERSON_REMOVED_URL,
            path: "/confirmation-person-removed"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.CONFIRMATION_PERSON_REMOVED_URL,
            path: "/confirmation-person-removed",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/1234567890",
            params: { companyNumber: "AB123456", associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/1234567890",
            params: { companyNumber: "AB123456", associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-person-removed-themselves",
            routePattern: constants.REMOVED_THEMSELVES_URL,
            path: "/confirmation-person-removed-themselves"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.REMOVED_THEMSELVES_URL,
            path: "/confirmation-person-removed-themselves"
        },
        {
            referer: "https://chc.local/your-companies/remove-company/AB123456",
            routePattern: constants.REMOVE_COMPANY_URL,
            path: "/remove-company/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies",
            routePattern: constants.REMOVE_COMPANY_URL,
            path: "/remove-company/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-company-removed",
            routePattern: constants.REMOVE_COMPANY_CONFIRMED_URL,
            path: "/confirmation-company-removed"
        },
        {
            referer: "https://chc.local/your-companies/remove-company/AB123456",
            routePattern: constants.REMOVE_COMPANY_CONFIRMED_URL,
            path: "/confirmation-company-removed"
        },
        {
            referer: "https://chc.local/your-companies/confirm-company-details",
            routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
            path: "/confirm-company-details"
        },
        {
            referer: "https://chc.local/your-companies/add-company",
            routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
            path: "/confirm-company-details"
        },
        {
            referer: "https://chc.local/your-companies/confirmation-company-added",
            routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
            path: "/confirmation-company-added"
        },
        {
            referer: "https://chc.local/your-companies/confirm-company-details",
            routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
            path: "/confirmation-company-added"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/create-company-association",
            routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
            path: "/confirmation-company-added",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/add-presenter/AB123456",
            routePattern: constants.ADD_PRESENTER_URL,
            path: "/add-presenter/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.ADD_PRESENTER_URL,
            path: "/add-presenter/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.ADD_PRESENTER_URL,
            path: "/add-presenter/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.CHECK_PRESENTER_URL,
            path: "/add-presenter-check-details/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/add-presenter/AB123456",
            routePattern: constants.CHECK_PRESENTER_URL,
            path: "/add-presenter-check-details/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/company-invitations-decline/1234567890",
            routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
            path: "/company-invitations-decline/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/company-invitations",
            routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
            path: "/company-invitations-decline/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/company-invitations-accept/1234567890",
            routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
            path: "/company-invitations-accept/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/company-invitations",
            routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
            path: "/company-invitations-accept/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/presenter-already-added/AB123456",
            routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
            path: "/presenter-already-added/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
            path: "/presenter-already-added/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/confirmation-your-digital-authorisation-restored",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/company/AB123456/confirmation-your-digital-authorisation-restored",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://accounturl.co",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/company/AB123456/confirmation-your-digital-authorisation-restored",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/company/AB123456//confirmation-your-digital-authorisation-restored",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/send-email-invitation-to-be-digitally-authorised/1234567890",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/remove-authorisation-do-not-restore/AB123456",
            routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
            path: "/remove-authorisation-do-not-restore/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies",
            routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
            path: "/remove-authorisation-do-not-restore/AB123456",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-authorisation-removed",
            routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
            path: "/confirmation-authorisation-removed"
        },
        {
            referer: "https://chc.local/your-companies/remove-authorisation-do-not-restore/AB123456",
            routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
            path: "/confirmation-authorisation-removed",
            params: {}
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/create-company-association",
            routePattern: constants.CREATE_COMPANY_ASSOCIATION_URL,
            path: "/company/AB123456/create-company-association",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/confirm-company-details",
            routePattern: constants.CREATE_COMPANY_ASSOCIATION_URL,
            path: "/company/AB123456/create-company-association",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://accounturl.co",
            routePattern: constants.CREATE_COMPANY_ASSOCIATION_URL,
            path: "/company/AB123456/create-company-association",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/restore-your-digital-authorisation/AB123456/confirm-company-details",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/",
            routePattern: constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/restore-your-digital-authorisation/AB123456/confirm-company-details",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people-email-resent/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            params: { userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            params: { userEmail: "test@example.com", companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-persons-digital-authorisation-restored",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_URL,
            path: "/confirmation-persons-digital-authorisation-restored"
        },
        {
            referer: "https://chc.local/your-companies/send-email-invitation-to-be-digitally-authorised/1234567890",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_URL,
            path: "/confirmation-persons-digital-authorisation-restored",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-persons-digital-authorisation-cancelled",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_URL,
            path: "/confirmation-persons-digital-authorisation-cancelled"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_URL,
            path: "/confirmation-persons-digital-authorisation-cancelled",
            params: { associationId: "1234567890", companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-persons-digital-authorisation-removed-not-restored",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_URL,
            path: "/confirmation-persons-digital-authorisation-removed-not-restored"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_URL,
            path: "/confirmation-persons-digital-authorisation-removed-not-restored",
            params: { associationId: "1234567890", companyNumber: "AB123456" }
        }
    ])("should call next() function if referer for route $routePattern is $referer",
        async ({ referer, path, params }) => {
            // Given
            const headers = { referer };
            const req: Request = mockParametrisedRequest({ baseUrl: constants.LANDING_URL, session, params, headers, path });
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER).mockReturnValue("AB123456");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL).mockReturnValue("test@example.com");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID).mockReturnValue("1234567890");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS).mockReturnValue(true);
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS).mockReturnValue(true);
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE).mockReturnValue(true);
            // When
            await navigationMiddleware(req, res, next);
            // Then
            expect(next).toHaveBeenCalled();
        });

    test.each([
        {
            routePattern: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL,
            path: "/confirmation-authorisation-email-resent",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CONFIRMATION_PERSON_ADDED_URL,
            path: "/confirmation-person-added",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CONFIRMATION_PERSON_REMOVED_URL,
            path: "/confirmation-person-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/1234567890",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.REMOVED_THEMSELVES_URL,
            path: "/confirmation-person-removed-themselves",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.REMOVE_COMPANY_URL,
            path: "/remove-company/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.REMOVE_COMPANY_CONFIRMED_URL,
            path: "/confirmation-company-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
            path: "/confirm-company-details",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
            path: "/confirmation-company-added",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.ADD_PRESENTER_URL,
            path: "/add-presenter/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CHECK_PRESENTER_URL,
            path: "/add-presenter-check-details/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
            path: "/company-invitations-decline/1234567890",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
            path: "/company-invitations-accept/1234567890",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
            path: "/presenter-already-added/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/company/AB123456/confirmation-your-digital-authorisation-restored",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
            path: "/remove-authorisation-do-not-restore/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
            path: "/confirmation-authorisation-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CREATE_COMPANY_ASSOCIATION_URL,
            path: "/company/AB123456/create-company-association",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/restore-your-digital-authorisation/AB123456/confirm-company-details",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_URL,
            path: "/confirmation-persons-digital-authorisation-restored",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_URL,
            path: "/confirmation-persons-digital-authorisation-cancelled",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_URL,
            path: "/confirmation-persons-digital-authorisation-removed-not-restored",
            defaultRedirect: constants.LANDING_URL
        }
    ])("should redirect to the default page if referer for route $routePattern is a wrong page",
        async ({ path, defaultRedirect }) => {
            // Given
            const headers = { referer: "https://chc.local/your-companies/some-other-page" };
            const req: Request = mockParametrisedRequest({ baseUrl: constants.LANDING_URL, session, headers, path });
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER).mockReturnValue("AB123456");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL).mockReturnValue("test@example.com");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID).mockReturnValue("1234567890");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS).mockReturnValue(false);
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS).mockReturnValue(false);
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE).mockReturnValue(false);
            // When
            await navigationMiddleware(req, res, next);
            // Then
            expect(res.redirect).toHaveBeenCalledWith(defaultRedirect);
        });

    test.each([
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.CONFIRMATION_PERSON_ADDED_URL,
            path: "/confirmation-person-added",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.CONFIRMATION_PERSON_REMOVED_URL,
            path: "/confirmation-person-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/:companyNumber/authentication-code-remove/:associationId",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/:companyNumber/authentication-code-remove/:associationId",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.REMOVED_THEMSELVES_URL,
            path: "/confirmation-person-removed-themselves",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/remove-company/AB123456",
            routePattern: constants.REMOVE_COMPANY_URL,
            path: "/remove-company/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/remove-company/AB123456",
            routePattern: constants.REMOVE_COMPANY_CONFIRMED_URL,
            path: "/confirmation-company-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/add-presenter/AB123456",
            routePattern: constants.ADD_PRESENTER_URL,
            path: "/add-presenter/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.ADD_PRESENTER_URL,
            path: "/add-presenter/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.CHECK_PRESENTER_URL,
            path: "/add-presenter-check-details/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/add-presenter/AB123456",
            routePattern: constants.CHECK_PRESENTER_URL,
            path: "/add-presenter-check-details/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company-invitations-decline/1234567890",
            routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
            path: "/company-invitations-decline/1234567890",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company-invitations-accept/1234567890",
            routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
            path: "/company-invitations-accept/1234567890",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/presenter-already-added/AB123456",
            routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
            path: "/presenter-already-added/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
            path: "/presenter-already-added/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/company/AB123456/confirmation-your-digital-authorisation-restored",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/confirmation-your-digital-authorisation-restored",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/company/AB123456/confirmation-your-digital-authorisation-restored",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/send-email-invitation-to-be-digitally-authorised/1234567890",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/remove-authorisation-do-not-restore/AB123456",
            routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
            path: "/remove-authorisation-do-not-restore/AB123456",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/remove-authorisation-do-not-restore/AB123456",
            routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
            path: "/confirmation-authorisation-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/restore-your-digital-authorisation/AB123456/confirm-company-details",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people-email-resent/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people-email-resent/test@example.com",
            routePattern: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL,
            path: "/confirmation-authorisation-email-resent",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL,
            path: "/confirmation-authorisation-email-resent",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_URL,
            path: "/confirmation-persons-digital-authorisation-restored",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_URL,
            path: "/confirmation-persons-digital-authorisation-cancelled",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/1234567890",
            routePattern: constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_URL,
            path: "/confirmation-persons-digital-authorisation-removed-not-restored",
            defaultRedirect: constants.LANDING_URL
        }
    ])("should redirect to the default page if referer for route $routePattern has wrong parameter",
        async ({ path, referer, defaultRedirect }) => {
            // Given
            const headers = { referer };
            const req: Request = mockParametrisedRequest({ baseUrl: constants.LANDING_URL, session, headers, path });
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER).mockReturnValue("XX111111");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL).mockReturnValue(["other@example.com"]);
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID).mockReturnValue("9999999999");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS).mockReturnValue(false);
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS).mockReturnValue(false);
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE).mockReturnValue(false);
            // When
            await navigationMiddleware(req, res, next);
            // Then
            expect(res.redirect).toHaveBeenCalledWith(defaultRedirect);
        });

    test.each([
        {
            routePattern: constants.CREATE_COMPANY_ASSOCIATION_URL,
            path: "/company/AB123456/create-company-association",
            sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS
        },
        {
            routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
            path: "/confirmation-company-added",
            sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS
        },
        {
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/confirmation-your-digital-authorisation-restored",
            sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS
        },
        {
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/1234567890",
            sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE
        }
    ])("should call next() function if referer for route $routePattern is undefined and $sessionFlag is present",
        async ({ path, sessionFlag }) => {
            // Given
            const headers = { referer: undefined };
            const req: Request = mockParametrisedRequest({ baseUrl: constants.LANDING_URL, session, headers, path });
            when(getExtraDataSpy).calledWith(session, sessionFlag).mockReturnValue(true);
            // When
            await navigationMiddleware(req, res, next);
            // Then
            expect(next).toHaveBeenCalled();
        });

    test.each([
        {
            routePattern: constants.CREATE_COMPANY_ASSOCIATION_URL,
            path: "/company/AB123456/create-company-association",
            sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS,
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
            path: "/confirmation-company-added",
            sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS,
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/company/AB123456/confirmation-your-digital-authorisation-restored",
            sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS,
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/1234567890",
            sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE,
            defaultRedirect: constants.LANDING_URL
        }
    ])("should redirect to the default page if referer for route $routePattern is undefined and $sessionFlag is not present",
        async ({ path, sessionFlag, defaultRedirect }) => {
            // Given
            const headers = { referer: undefined };
            const req: Request = mockParametrisedRequest({ baseUrl: constants.LANDING_URL, session, headers, path });
            when(getExtraDataSpy).calledWith(session, sessionFlag).mockReturnValue(false);
            // When
            await navigationMiddleware(req, res, next);
            // Then
            expect(res.redirect).toHaveBeenCalledWith(defaultRedirect);
        });
});
