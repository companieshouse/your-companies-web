import { NextFunction, Request, Response } from "express";
import { companyAuthenticationMiddlewareCheckboxEnabled, companyAuthenticationMiddlewareCheckboxDisabled } from "../../src/middleware/company.authentication";

jest.mock("../../src/middleware/company.authentication");

const mockCompanyAuthenticationMiddlewareCheckboxEnabled = companyAuthenticationMiddlewareCheckboxEnabled as jest.Mock;
const mockCompanyAuthenticationMiddlewareCheckboxDisabled = companyAuthenticationMiddlewareCheckboxDisabled as jest.Mock;

mockCompanyAuthenticationMiddlewareCheckboxEnabled.mockImplementation((req: Request, res: Response, next: NextFunction) => next());
mockCompanyAuthenticationMiddlewareCheckboxDisabled.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export { mockCompanyAuthenticationMiddlewareCheckboxEnabled, mockCompanyAuthenticationMiddlewareCheckboxDisabled };
