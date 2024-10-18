import { NextFunction, Request, Response } from "express";
import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";

jest.mock("@companieshouse/web-security-node");
const mockCsrfProtectionMiddleware = CsrfProtectionMiddleware as jest.Mock;
mockCsrfProtectionMiddleware.mockImplementation((_opts) => (req: Request, res: Response, next: NextFunction) => next());

export default mockCsrfProtectionMiddleware;
