import { Request } from "express";

export const mockRequest = () => {
    const req = {
        originalUrl: "",
        headers: {
            referer: undefined
        }
    } as Request;
    req.params = {
        companyNumber: "1"
    };
    return req;
};
