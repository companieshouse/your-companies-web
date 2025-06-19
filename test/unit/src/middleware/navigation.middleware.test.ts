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
            path: "/manage-authorised-people/AB123456/confirmation-cancel-person"
        }
    ])("should redirect to the default page if referer for route $route is a wrong page",
        ({ path }) => {
            // Given
            req.path = path;
            req.headers.referer = "https://chc.local/your-companies/some-other-page";
            // When
            navigationMiddleware(req, res, next);
            // Then
            expect(res.redirect).toHaveBeenCalled();
        });
});
