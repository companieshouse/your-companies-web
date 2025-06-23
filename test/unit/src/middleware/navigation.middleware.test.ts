import { Request, Response } from "express";
import * as constants from "../../../../src/constants";
import { navigationMiddleware } from "../../../../src/middleware/navigation.middleware";
import { mockParametrisedRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";

const req: Request = mockParametrisedRequest({ baseUrl: constants.LANDING_URL });
const res: Response = mockResponse();
const next = jest.fn();

describe("navigationMiddleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-cancel-person",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/cancel-person/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/authorisation-email-resent",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people-email-resent/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-added",
            routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added"
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-removed",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/test@example.com",
            routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/test@example.com",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/:companyNumber/authentication-code-remove/:userEmail"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/:companyNumber/authentication-code-remove/:userEmail"
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
            path: "/remove-company/AB123456"
        },
        {
            referer: "https://chc.local/your-companies",
            routePattern: constants.REMOVE_COMPANY_URL,
            path: "/remove-company/AB123456"
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
            path: "/company/AB123456/cancel-person/test@example.com"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
            path: "/company/AB123456/cancel-person/test@example.com"
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
            referer: "https://chc.local/your-companies/add-presenter/AB123456",
            routePattern: constants.ADD_PRESENTER_URL,
            path: "/add-presenter/AB123456"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.ADD_PRESENTER_URL,
            path: "/add-presenter/AB123456"
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.CHECK_PRESENTER_URL,
            path: "/add-presenter-check-details/AB123456"
        },
        {
            referer: "https://chc.local/your-companies/add-presenter/AB123456",
            routePattern: constants.CHECK_PRESENTER_URL,
            path: "/add-presenter-check-details/AB123456"
        },
        {
            referer: "https://chc.local/your-companies/company-invitations-decline/1234567890",
            routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
            path: "/company-invitations-decline/1234567890"
        },
        {
            referer: "https://chc.local/your-companies/company-invitations",
            routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
            path: "/company-invitations-decline/1234567890"
        },
        {
            referer: "https://chc.local/your-companies/company-invitations-accept/1234567890",
            routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
            path: "/company-invitations-accept/1234567890"
        },
        {
            referer: "https://chc.local/your-companies/company-invitations",
            routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
            path: "/company-invitations-accept/1234567890"
        },
        {
            referer: "https://chc.local/your-companies/presenter-already-added/AB123456",
            routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
            path: "/presenter-already-added/AB123456"
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
            path: "/presenter-already-added/AB123456"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/try-restoring-your-digital-authorisation",
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation"
        },
        {
            referer: "https://accounturl.co",
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation"
        },
        {
            referer: "https://chc.local/your-companies/restore-your-digital-authorisation/AB123456/confirm-company-details",
            routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
            path: "/company/AB123456/try-restoring-your-digital-authorisation"
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
            path: "/confirmation-your-digital-authorisation-restored"
        },
        {
            referer: "https://chc.local/your-companies/send-email-invitation-to-be-digitally-authorised/1234567890",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
            path: "/send-email-invitation-to-be-digitally-authorised/1234567890"
        },
        {
            referer: "https://chc.local/your-companies/remove-authorisation-do-not-restore/AB123456",
            routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
            path: "/remove-authorisation-do-not-restore/AB123456"
        },
        {
            referer: "https://chc.local/your-companies",
            routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
            path: "/remove-authorisation-do-not-restore/AB123456"
        },
        {
            referer: "https://chc.local/your-companies/confirmation-authorisation-removed",
            routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
            path: "/confirmation-authorisation-removed"
        },
        {
            referer: "https://chc.local/your-companies/remove-authorisation-do-not-restore/AB123456",
            routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
            path: "/confirmation-authorisation-removed"
        }
    ])("should call next() function if referer for route $routePattern is $referer",
        ({ referer, path }) => {
            // Given
            req.path = `${constants.LANDING_URL}/${path}`;
            req.headers.referer = referer;
            // When
            navigationMiddleware(req, res, next);
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
        }
    ])("should redirect to the default page if referer for route $routePattern is a wrong page",
        ({ path, defaultRedirect }) => {
            // Given
            req.path = `${constants.LANDING_URL}/${path}`;
            req.headers.referer = "https://chc.local/your-companies/some-other-page";
            // When
            navigationMiddleware(req, res, next);
            // Then
            expect(res.redirect).toHaveBeenCalledWith(defaultRedirect);
        });
});
