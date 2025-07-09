import { NextFunction, Request, Response } from "express";
import { navigationMiddleware } from "../../src/middleware/navigation.middleware";

jest.mock("../../src/middleware/navigation.middleware");

// get handle on mocked function
const mockNavigationMiddleware = navigationMiddleware as jest.Mock;

// tell the mock what to return
mockNavigationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockNavigationMiddleware;
