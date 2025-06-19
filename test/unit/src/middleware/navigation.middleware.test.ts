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
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/cancel-person/test@example.com",
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/authorisation-email-resent",
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people-email-resent/test@example.com",
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-added",
            route: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added"
        },
        {
            referer: "https://chc.local/your-companies/add-presenter-check-details/AB123456",
            route: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456/confirmation-person-removed",
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/test@example.com",
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed"
        },
        {
            referer: "https://chc.local/your-companies/company/AB123456/authentication-code-remove/test@example.com",
            route: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/:companyNumber/authentication-code-remove/:userEmail"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            route: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/:companyNumber/authentication-code-remove/:userEmail"
        },
        {
            referer: "https://chc.local/your-companies/confirmation-person-removed-themselves",
            route: constants.REMOVED_THEMSELVES_URL,
            path: "/confirmation-person-removed-themselves"
        },
        {
            referer: "https://chc.local/your-companies/manage-authorised-people/AB123456",
            route: constants.REMOVED_THEMSELVES_URL,
            path: "/confirmation-person-removed-themselves"
        },
        {
            referer: "https://chc.local/your-companies/remove-company/AB123456",
            route: constants.REMOVE_COMPANY_URL,
            path: "/remove-company/AB123456"
        },
        {
            referer: "https://chc.local/your-companies",
            route: constants.REMOVE_COMPANY_URL,
            path: "/remove-company/AB123456"
        }
    ])("should call next() function if referer for route $route is $referer",
        ({ referer, path }) => {
            // Given
            req.path = path;
            req.headers.referer = referer;
            // When
            navigationMiddleware(req, res, next);
            // Then
            expect(next).toHaveBeenCalled();
        });

    test.each([
        {
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person",
            defaultRedirect: constants.LANDING_URL
        },
        {
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
            path: "/manage-authorised-people/AB123456/authorisation-email-resent",
            defaultRedirect: constants.LANDING_URL
        },
        {
            route: constants.AUTHORISED_PERSON_ADDED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-added",
            defaultRedirect: constants.LANDING_URL
        },
        {
            route: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
            path: "/manage-authorised-people/AB123456/confirmation-person-removed",
            defaultRedirect: constants.LANDING_URL
        },
        {
            route: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
            path: "/company/AB123456/authentication-code-remove/test@example.com",
            defaultRedirect: constants.LANDING_URL
        },
        {
            route: constants.REMOVED_THEMSELVES_URL,
            path: "/confirmation-person-removed-themselves",
            defaultRedirect: constants.LANDING_URL
        },
        {
            route: constants.REMOVE_COMPANY_URL,
            path: "/remove-company/AB123456",
            defaultRedirect: constants.LANDING_URL
        }
    ])("should redirect to the default page if referer for route $route is a wrong page",
        ({ path, defaultRedirect }) => {
            // Given
            req.path = path;
            req.headers.referer = "https://chc.local/your-companies/some-other-page";
            // When
            navigationMiddleware(req, res, next);
            // Then
            expect(res.redirect).toHaveBeenCalledWith(defaultRedirect);
        });
});
