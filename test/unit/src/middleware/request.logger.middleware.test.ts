import { requestLogger } from "../../../../src/middleware/request.logger.middleware";
import { Request, Response } from "express";
import logger from "../../../../src/lib/Logger";
import { EventEmitter } from "node:events";

describe("requestLogger middleware", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("skips logging and calls next for /healthcheck", () => {
        const req = {
            url: "/healthcheck"
        } as Partial<Request> as Request;

        const res = {} as Partial<Response> as Response;
        const next = jest.fn();

        const debugRequestSpy = jest.spyOn(logger, "debugRequest").mockImplementation(jest.fn());
        const debugSpy = jest.spyOn(logger, "debug").mockImplementation(jest.fn());
        const errorSpy = jest.spyOn(logger, "error").mockImplementation(jest.fn());

        requestLogger(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(debugRequestSpy).not.toHaveBeenCalled();
        expect(debugSpy).not.toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("logs OPEN and CLOSED when requestId is present on req object", () => {
        const req = {
            url: "/api/test",
            originalUrl: "/api/test?foo=bar",
            method: "GET",
            requestId: "abc-123"
        } as Partial<Request> as Request;

        const resEmitter = new EventEmitter();
        const res = Object.assign(resEmitter, { statusCode: 200 }) as unknown as Response;

        const next = jest.fn();

        const infoSpy = jest.spyOn(logger, "info").mockImplementation(jest.fn());
        const errorSpy = jest.spyOn(logger, "error").mockImplementation(jest.fn());

        requestLogger(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);

        expect(infoSpy).toHaveBeenCalledWith(
            expect.stringContaining(`OPEN [abc-123]: GET /api/test?foo=bar`)
        );

        resEmitter.emit("finish");

        expect(infoSpy).toHaveBeenCalledWith(
            expect.stringMatching(/CLOSED \[abc-123\] after .*ms with status 200/)
        );
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("logs error and uses UNKNOWN requestId when header missing", () => {
        const req = {
            url: "/api/test",
            originalUrl: "/api/test",
            method: "POST",
            headers: {} // no requestId
        } as Partial<Request> as Request;

        const resEmitter = new EventEmitter();
        const res = Object.assign(resEmitter, { statusCode: 500 }) as unknown as Response;

        const next = jest.fn();

        const loggerInfoSpy = jest.spyOn(logger, "info").mockImplementation(jest.fn());
        const errorSpy = jest.spyOn(logger, "error").mockImplementation(jest.fn());

        requestLogger(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);

        expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining("Missing requestId.")
        );

        expect(loggerInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining(`OPEN [UNKNOWN]: POST /api/test`)
        );

        resEmitter.emit("finish");

        expect(loggerInfoSpy).toHaveBeenCalledWith(
            expect.stringMatching(/CLOSED \[UNKNOWN\] after .*ms with status 500/)
        );
    });
});
