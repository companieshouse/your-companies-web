import { NextFunction, Request, Response } from "express";
import { csrfProtectionMiddleware } from "../../src/middleware/csrf.protection.middleware";

jest.mock("../../src/middleware/csrf.protection.middleware");

const mockCsrfProtectionMiddleware = csrfProtectionMiddleware as jest.Mock;

mockCsrfProtectionMiddleware.mockImplementation((_opts) => (_req: Request, _res: Response, next: NextFunction) => next());

export default mockCsrfProtectionMiddleware;
