import { httpErrorHandler } from "../../../../src/routers/controllers/httpErrorController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { NextFunction } from "express";
import logger from "../../../../src/lib/Logger";

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

    it("should detect a http-error Error, call logger.errorRequest and render an service unavailable template", async () => {
        // Given
        const HTTP_STATUS_CODE = StatusCodes.UNAUTHORIZED;
        request.originalUrl = "/originalUrl";
        request.method = "POST";

        const unauthorizedError = createError(HTTP_STATUS_CODE, `An error messsage`);
        // When
        httpErrorHandler(unauthorizedError, request, response, mockNext);
        // Then
        expect(response.render).toHaveBeenCalledWith("partials/service_unavailable.njk");
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError`)
        );
    });
    it("should ignore errors that are not from http-errors modules, and pass then to next", async () => {
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
});
