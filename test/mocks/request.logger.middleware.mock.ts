import { NextFunction, Request, Response } from "express";
import { requestLogger } from "../../src/middleware/request.logger.middleware";

jest.mock("../../src/middleware/request.logger.middleware");

// get handle on mocked function
const mockRequestLogger = requestLogger as jest.Mock;

// tell the mock what to return
mockRequestLogger.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockRequestLogger;
