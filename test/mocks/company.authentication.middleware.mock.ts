import { NextFunction, Request, Response } from "express";
import { companyAuthenticationMiddlewareCheckboxDisabled } from "../../src/middleware/company.authentication";

jest.mock("../../src/middleware/company.authentication");

const mockCompanyAuthenticationMiddlewareCheckboxDisabled = companyAuthenticationMiddlewareCheckboxDisabled as jest.Mock;

mockCompanyAuthenticationMiddlewareCheckboxDisabled.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export { mockCompanyAuthenticationMiddlewareCheckboxDisabled };
