import { Request } from "express";

export const mockParametrisedRequest = (overrides: any) => {
    const req = {
        body: {},
        params: {},
        query: {},
        headers: {},
        get: jest.fn().mockReturnValue(""),
        ...overrides
    };
    return req;
};

export const mockRequest = (): Request => {
    const req = {
        originalUrl: "",
        headers: {
            referer: undefined
        }
    } as Request;
    req.params = {
        companyNumber: "1"
    };
    req.get = jest.fn();
    return req;
};
