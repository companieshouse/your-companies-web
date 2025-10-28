import { Request, Response } from "express";
import { requestIdGenerator } from "../../../../src/middleware/request.id.generator.middleware";

jest.mock("crypto", () => {
    const actual = jest.requireActual("crypto");
    return {
        ...actual,
        randomUUID: jest.fn().mockReturnValue("3dce321a-0ab4-4a18-8677-836c2348150b")
    };
});

describe("requestIdGenerator middleware", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("sets req.requestId (hyphens removed), sets header and calls next", () => {

        const req = {} as Partial<Request> as Request & { requestId?: string };
        const setHeader = jest.fn();
        const res = { setHeader } as Partial<Response> as Response;
        const next = jest.fn();

        requestIdGenerator(req, res, next);

        const expectedId = "3dce321a0ab44a188677836c2348150b";

        expect(req.requestId).toBe(expectedId);
        expect(setHeader).toHaveBeenCalledWith("X-Request-Id", expectedId);
        expect(next).toHaveBeenCalledTimes(1);
    });
});
