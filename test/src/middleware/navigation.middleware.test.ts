
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

    it("should redirect if no referer", () => {
        const mockedNext = jest.fn();
        const mockedReq = mockReq();
        const mockedRes = mockRes();
        //  mockedReq.headers.referer = undefined;
        isComingFromCheckEmailPage(mockedReq, mockedRes, mockedNext);
        expect(mockedNext).not.toHaveBeenCalled();
        expect(mockedRes.redirect).toHaveBeenCalled();
    });
    it("should allow request from the check email page", () => {
        const mockedNext = jest.fn();
        const mockedReq = mockReq();
        const mockedRes = mockRes();
        const url = `/your-companies/company/12345678/add-presenter-check-details`;
        mockedReq.headers.referer = url;
        isComingFromCheckEmailPage(mockedReq, mockedRes, mockedNext);
        expect(mockedNext).toHaveBeenCalled();
    });
    // it("should allow requests from the authorised email add success page", () => {
    //     const mockedNext = jest.fn();
    //     const mockedReq = mockReq();
    //     const mockedRes = mockRes();
    //     const companyNumber = "NI038379";
    //     const url2 = "/your-companies/manage-authorised-people/12345/confirmation-person-added";
    //     const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-person-added`;
    //     mockedReq.headers.referer = url2;
    //     isComingFromCheckEmailPage(mockedReq, mockedRes, mockedNext);
    //     expect(mockedNext).toHaveBeenCalled();
    // });
    it("should return an error page if there is an unrecognised referer", () => {
        const mockedNext = jest.fn();
        const mockedReq = mockReq();
        const mockedRes = mockRes();
        //  mockedReq.headers.referer = undefined;
        isComingFromCheckEmailPage(mockedReq, mockedRes, mockedNext);
        expect(mockedNext).not.toHaveBeenCalled();
        expect(mockedRes.redirect).toHaveBeenCalled();
    });

});
