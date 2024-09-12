import { httpErrorHandler } from "../../../../src/routers/controllers/httpErrorController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { NextFunction } from "express";
import logger from "../../../../src/lib/Logger";
import * as getTranslationsForView from "../../../../src/lib/utils/translations";

const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");

logger.errorRequest = jest.fn();

jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");
    return {
        __esModule: true,
        ...originalModule,
        setExtraData: jest.fn()
    };
});
const session: Session = new Session();
const request = mockRequest();
request.session = session;
const response = mockResponse();
const mockNext: NextFunction = jest.fn();

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
        expect(response.render).toHaveBeenCalledWith("partials/service_unavailable", expect.objectContaining({
            lang: {},
            templateName: "service-unavailable"
        }));
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError error occurred when a POST request was made to /originalUrl. Re-routing to the error template page. Error name: UnauthorizedError, Error status: 401, Error message:  + An error messsage, Stack:`)
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
        const result = httpErrorHandler(unauthorizedError, request, response, mockNext);
        // Then
        expect(response.render).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/your-companies");
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError error occurred when a GET request was made to /originalUrl. Re-routing to the error template page. Error name: UnauthorizedError, Error status: 401, Error message:  + An error messsage, Stack:`)
        );
        expect(result).toEqual(undefined);
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
        expect(response.render).toHaveBeenCalledWith("partials/service_unavailable", expect.objectContaining({
            lang: {},
            templateName: "service-unavailable"
        }));
        expect(response.redirect).not.toHaveBeenCalled();
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError error occurred when a GET request was made to /originalUrl. Re-routing to the error template page. Error name: UnauthorizedError, Error status: 401, Error message:  + An error messsage, Stack:`)
        );
    });
});
