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
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-cancel-person",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/cancel-person/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: undefined,
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/authorisation-email-resent",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people-email-resent/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-cancel-person",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-added",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-removed",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-digital-authorisation-restored",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-added",
            routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-removed",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/test@example.com",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-cancel-person",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/authorisation-email-resent",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-added",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-removed",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-digital-authorisation-restored",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-person-removed-themselves",
            routePattern: constants.REMOVED_THEMSELVES_URL,
            path: "/confirmation-person-removed-themselves"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
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
            referer: "https://chc.local/your-companies/company/AB123456/cancel-person/test@example.com",
            routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
            path: "/company/AB123456/cancel-person/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
            path: "/company/AB123456/cancel-person/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
        },
        {
            referer: undefined,
            routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
            path: "/company/AB123456/cancel-person/test@example.com",
            params: { companyNumber: "AB123456", userEmail: "test@example.com" }
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
            referer: undefined,
            routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
            path: "/confirmation-company-added"
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
            referer: "https://chc.local/your-companies/company/AB123456/try-restoring-your-digital-authorisation",
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://accounturl.co",
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/confirmation-your-digital-authorisation-restored",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/confirmation-your-digital-authorisation-restored"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/try-restoring-your-digital-authorisation",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/confirmation-your-digital-authorisation-restored"
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/confirmation-your-digital-authorisation-restored",
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
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-cancel-person",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/authorisation-email-resent",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-added",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-removed",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890",
            params: { associationId: "1234567890" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-digital-authorisation-restored",
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
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-cancel-person",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            params: { userEmail: "test@example.com", companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/authorisation-email-resent",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            params: { userEmail: "test@example.com", companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-added",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            params: { userEmail: "test@example.com", companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-removed",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            params: { userEmail: "test@example.com", companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-digital-authorisation-restored",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            path: "/manage-authorised-people-email-resent/test@example.com",
            params: { userEmail: "test@example.com", companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-digital-authorisation-restored",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-digital-authorisation-restored",
            params: { companyNumber: "AB123456" }
        },
        {
            referer: "https://chc.local/your-companies/send-email-invitation-to-be-digitally-authorised/1234567890",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-digital-authorisation-restored",
            params: { associationId: "1234567890" }
        }
    ])("should call next() function if referer for route $routePattern is $referer",
        async ({ referer, path, params }) => {
            // Given
            const headers = { referer };
            const req: Request = mockParametrisedRequest({ baseUrl: constants.LANDING_URL, session, params, headers, path });
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER).mockReturnValue("AB123456");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL).mockReturnValue("test@example.com");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID).mockReturnValue("1234567890");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE).mockReturnValue(true);
            // When
            await navigationMiddleware(req, res, next);
            // Then
            expect(next).toHaveBeenCalled();
        });

    test.each([
        {
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
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
            routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
            path: "/company/AB123456/cancel-person/test@example.com",
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
            defaultRedirect: `${constants.LANDING_URL}${constants.COMPANY_INVITATIONS_URL}`
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
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation",
            defaultRedirect: constants.LANDING_URL
        },
        {
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/confirmation-your-digital-authorisation-restored",
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
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-digital-authorisation-restored",
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
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE).mockReturnValue(false);
            // When
            await navigationMiddleware(req, res, next);
            // Then
            expect(res.redirect).toHaveBeenCalledWith(defaultRedirect);
        });

    test.each([
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-cancel-person",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/cancel-person/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/authorisation-email-resent",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people-email-resent/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-added",
            routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-removed",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/test@example.com",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/:companyNumber/authentication-code-remove/:userEmail",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/:companyNumber/authentication-code-remove/:userEmail",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
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
            referer: "https://chc.local/your-companies/company/AB123456/cancel-person/test@example.com",
            routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
            path: "/company/AB123456/cancel-person/test@example.com",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
            path: "/company/AB123456/cancel-person/test@example.com",
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
            defaultRedirect: `${constants.LANDING_URL}${constants.COMPANY_INVITATIONS_URL}`
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
            referer: "https://chc.local/your-companies/company/AB123456/try-restoring-your-digital-authorisation",
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/try-restoring-your-digital-authorisation",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/confirmation-your-digital-authorisation-restored",
            defaultRedirect: constants.LANDING_URL
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
            path: "/confirmation-your-digital-authorisation-restored",
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
        }
    ])("should redirect to the default page if referer for route $routePattern has wrong parameter",
        async ({ path, referer, defaultRedirect }) => {
            // Given
            const headers = { referer };
            const req: Request = mockParametrisedRequest({ baseUrl: constants.LANDING_URL, session, headers, path });
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER).mockReturnValue("XX111111");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL).mockReturnValue(["other@example.com"]);
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID).mockReturnValue("9999999999");
            when(getExtraDataSpy).calledWith(session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE).mockReturnValue(false);
            // When
            await navigationMiddleware(req, res, next);
            // Then
            expect(res.redirect).toHaveBeenCalledWith(defaultRedirect);
        });
});
