
import { Request, Response, NextFunction } from "express";
import { isComingFromCheckEmailPage } from "../../../src/middleware/navigation.middleware";

const URL = "/something";

const mockReq = () => {
    const req = {
        originalUrl: URL,
        headers: {
            referer: undefined
        }
    } as Request;
    req.params = {
        companyNumber: "1"
    };
    return req;
};

const mockRes = () => {
    const res = {} as Response;
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
};

describe("isComingFromCheckEmailPage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should ", () => {
        const mockedNext = jest.fn();
        const mockedReq = mockReq();
        const mockedRes = mockRes();
        //  mockedReq.headers.referer = undefined;
        isComingFromCheckEmailPage(mockedReq, mockedRes, mockedNext);
        expect(mockedNext).not.toHaveBeenCalled();
        expect(mockedRes.redirect).toHaveBeenCalled();
    });

    // it("should redirect to xxx when no originalUrl", () => {
    //     req.originalUrl = CONFIRMATION_STATEMENT + ACCESSIBILITY_STATEMENT;
    //     authenticationMiddleware(req, res, next);

    //     expect(mockAuthMiddleware).not.toHaveBeenCalled();
    //     expect(next).toHaveBeenCalled();
    // });

});
