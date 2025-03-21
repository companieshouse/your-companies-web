import { NextFunction, Request, Response } from "express";
import { healthCheckController } from "../../../../../src/routers/controllers/healthCheckController";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import logger from "../../../../../src/lib/Logger";

jest.mock("../../../../../src/lib/Logger");
const req: Request = mockRequest();
const res: Response = mockResponse();
const sendMock = jest.fn(() => res);
res.send = sendMock;
const statusMock = jest.fn(() => res);
res.status = statusMock;
const mockNext: NextFunction = jest.fn();
logger.debug = jest.fn();

describe("healthCheckController", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set status to 200 and send 'OK' response", async () => {
        // Given
        const expectedMessage = "GET healthcheck";
        // When
        healthCheckController(req as Request, res as Response, mockNext);
        // Then
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenCalledWith(expectedMessage);
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
        expect(sendMock).toHaveBeenCalledTimes(1);
        expect(sendMock).toHaveBeenCalledWith(ReasonPhrases.OK);
    });
});
