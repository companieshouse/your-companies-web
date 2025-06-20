import { NextFunction, Request, Response } from "express";
import { companyAuthenticationMiddleware, forceCompanyAuthenticationMiddleware } from "../../src/middleware/company.authentication";

jest.mock("../../src/middleware/company.authentication");

// get handle on mocked function
const mockCompanyAuthenticationMiddleware = companyAuthenticationMiddleware as jest.Mock;
const mockForceCompanyAuthenticationMiddleware = forceCompanyAuthenticationMiddleware as jest.Mock;

// tell the mock what to return
mockCompanyAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());
mockForceCompanyAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export {
    mockCompanyAuthenticationMiddleware,
    mockForceCompanyAuthenticationMiddleware
};
