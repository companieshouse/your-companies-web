import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../src/middleware/session.middleware";
import { Session } from "@companieshouse/node-session-handler";
import { validActiveCompanyProfile } from "../mocks/companyProfileMock";

jest.mock("ioredis");
jest.mock("../../src/middleware/session.middleware");

// get handle on mocked function
const mockSessionMiddleware = sessionMiddleware as jest.Mock;

export const session = new Session();

// tell the mock what to return
mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    //  req.session.data.extra_data.companyProfile = validActiveCompanyProfile;
    next();
});

export default mockSessionMiddleware;
