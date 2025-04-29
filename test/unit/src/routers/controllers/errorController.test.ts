import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { NextFunction, Request, Response } from "express";
import logger from "../../../../../src/lib/Logger";
import * as getTranslationsForView from "../../../../../src/lib/utils/translations";
import { CsrfError } from "@companieshouse/web-security-node";
import { csrfErrorHandler, httpErrorHandler } from "../../../../../src/routers/controllers/errorController";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import * as constants from "../../../../../src/constants";
import { getFullUrl } from "../../../../../src/lib/utils/urlUtils";

const mockGetTranslationsForView: jest.SpyInstance = jest.spyOn(getTranslationsForView, "getTranslationsForView");

jest.mock("../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        setExtraData: jest.fn()
    };
});

logger.errorRequest = jest.fn();
logger.error = jest.fn();
const request: Request = mockRequest();
const response: Response = mockResponse();
const mockNext: NextFunction = jest.fn();

describe("csrfErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should detect a csrfError and redirect to the something went wrong error page", async () => {
        // Given
        mockGetTranslationsForView.mockReturnValue({
            some_key: "some text",
            sorry_something_went_wrong: "Sorry, something went wrong",
            title_end: " - title end."
        });
        const err = new CsrfError();
        // When
        csrfErrorHandler(err, request, response, mockNext);
        // Then
        expect(response.status).toHaveBeenCalledWith(403);
        expect(response.redirect).toHaveBeenCalledWith(
            `${getFullUrl(constants.SOMETHING_WENT_WRONG_URL)}?${constants.CSRF_ERRORS}`
        );

        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining("CSRF Error occurred")
        );
    });

    it("should ignore errors that are not of type CsrfError and pass then to next", async () => {
        // Given
        const error = new Error();
        // When
        csrfErrorHandler(error, request, response, mockNext);
        // Then
        expect(response.redirect).not.toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});

describe("httpErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should detect a http-error Error, call logger.errorRequest and render an service unavailable template", () => {
        // Given
        const HTTP_STATUS_CODE = StatusCodes.UNAUTHORIZED;
        request.originalUrl = "/originalUrl";
        request.method = "POST";
        mockGetTranslationsForView.mockReturnValueOnce({});

        const unauthorizedError = createError(HTTP_STATUS_CODE, `An error messsage`);
        // When
        httpErrorHandler(unauthorizedError, request, response, mockNext);
        // Then
        expect(response.render).toHaveBeenCalledWith("partials/service_unavailable", expect.anything());
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError error occurred when a POST request was made to /originalUrl. Re-routing to the error template page. Error name: UnauthorizedError, Error status: 401, Error message: An error messsage, Stack:`)
        );
    });
    it("should ignore errors that are not from http-errors modules, and pass then to next", () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "POST";
        const error = new Error();
        // When
        httpErrorHandler(error, request, response, mockNext);
        // Then
        expect(response.render).not.toHaveBeenCalled();
        expect(logger.errorRequest).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should redirect to your-companies if error has property redirctToYourCompanies true", () => {
        const HTTP_STATUS_CODE = StatusCodes.UNAUTHORIZED;
        request.originalUrl = "/originalUrl";
        request.method = "GET";
        mockGetTranslationsForView.mockReturnValueOnce({});
        const unauthorizedError = createError(HTTP_STATUS_CODE, `An error messsage`, { redirctToYourCompanies: true });
        // When
        httpErrorHandler(unauthorizedError, request, response, mockNext);
        // Then
        expect(response.redirect).toHaveBeenCalledWith("/your-companies");
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError error occurred when a GET request was made to /originalUrl. Re-routing to the error template page. Error name: UnauthorizedError, Error status: 401, Error message: An error messsage, Stack:`)
        );
    });

    it("should not redirect to your-companies if error does not have property redirctToYourCompanies true", () => {
        const HTTP_STATUS_CODE = StatusCodes.UNAUTHORIZED;
        request.originalUrl = "/originalUrl";
        request.method = "GET";
        mockGetTranslationsForView.mockReturnValueOnce({});
        const unauthorizedError = createError(HTTP_STATUS_CODE, `An error messsage`, { redirctToYourCompanies: false });
        // When
        httpErrorHandler(unauthorizedError, request, response, mockNext);
        // Then
        expect(response.render).toHaveBeenCalledWith("partials/service_unavailable", expect.anything());
        expect(response.redirect).not.toHaveBeenCalled();
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError error occurred when a GET request was made to /originalUrl. Re-routing to the error template page. Error name: UnauthorizedError, Error status: 401, Error message: An error messsage, Stack:`)
        );
    });
});
