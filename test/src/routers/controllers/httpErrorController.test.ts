import { httpErrorHandler } from "../../../../src/routers/controllers/httpErrorController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { NextFunction } from "express";
import logger from "../../../../src/lib/Logger";

const mockNext: NextFunction = jest.fn();
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

describe("httpErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should detect unauthorised errors, then call render and logger.errorRequest", async () => {
        // Given
        const HTTP_STATUS_CODE = StatusCodes.UNAUTHORIZED;
        request.originalUrl = "/originalUrl";
        request.method = "POST";

        const unauthorizedError = createError(HTTP_STATUS_CODE, `An error messsage`);
        // When
        httpErrorHandler(unauthorizedError, request, response, mockNext);
        // Then
        expect(response.render).toHaveBeenCalledWith("partials/error_500");
        expect(logger.errorRequest).toHaveBeenCalledTimes(1);
        expect(logger.errorRequest).toHaveBeenCalledWith(request,
            expect.stringContaining(`A 401 UnauthorizedError`)
        );
    });

});
