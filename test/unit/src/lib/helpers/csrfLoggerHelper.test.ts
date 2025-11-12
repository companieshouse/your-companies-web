import { Request } from "express";
import { safeDebugCsrf } from "../../../../../src/lib/helpers/csrfLoggerHelper";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";

import logger from "../../../../../src/lib/Logger";
import { getLoggedInUserId } from "../../../../../src/lib/utils/sessionUtils";

jest.mock("../../../../../src/lib/Logger", () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        errorRequest: jest.fn()
    }
}));

jest.mock("../../../../../src/lib/utils/sessionUtils", () => ({
    __esModule: true,
    getLoggedInUserId: jest.fn().mockReturnValue("user-123")
}));

const mockedLogger = logger as unknown as {
  info: jest.Mock;
  errorRequest: jest.Mock;
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("safeDebugCsrf", () => {
    it("logs fingerprinted CSRF tokens (long tokens) and session info", () => {
        const req = {
            requestId: "req-1",
            method: "POST",
            originalUrl: "/some/path",
            body: { _csrf: "abcdefghijklmno" },
            headers: {},
            cookies: { _SID: "cookie-123" },
            session: {
                get: jest.fn().mockReturnValue("token-xyz-12345"),
                data: { [SessionKey.Id]: "session-id-98765" }
            }
        } as unknown as Request;

        safeDebugCsrf(req);

        expect(mockedLogger.info).toHaveBeenCalledTimes(1);
        const logged = mockedLogger.info.mock.calls[0][0] as string;

        expect(logged).toContain("requestId=req-1");
        expect(logged).toContain("method=POST");
        expect(logged).toContain("path=/some/path");
        expect(logged).toContain("userId=user-123");

        expect(logged).toContain("sessionId=sessi..765");

        expect(logged).toContain("sessionCsrfTokenFp=token..345");

        expect(logged).toContain("requestCsrfTokenFp=abcde..mno");

        expect(logged).toContain("hasSessionCookie=true");
    });

    it("prints short tokens with trailing '..' (<= 8 chars)", () => {
        const req = {
            requestId: "req-2",
            method: "GET",
            originalUrl: "/short-token",
            body: {},
            headers: {},
            cookies: {},
            session: {
                get: jest.fn().mockReturnValue("short"),
                data: { [SessionKey.Id]: "id" }
            }
        } as unknown as Request;

        safeDebugCsrf(req);

        expect(mockedLogger.info).toHaveBeenCalledTimes(1);
        const logged = mockedLogger.info.mock.calls[0][0] as string;

        expect(logged).toContain("sessionCsrfTokenFp=short..");
    });

    it("calls logger.errorRequest when logger.info throws", () => {
        mockedLogger.info.mockImplementation(() => {
            throw new Error("test logger error");
        });

        const req = {
            requestId: "req-3",
            method: "PUT",
            originalUrl: "/err",
            body: {},
            headers: {},
            cookies: {},
            session: {
                get: jest.fn().mockReturnValue(undefined),
                data: {}
            }
        } as unknown as Request;

        safeDebugCsrf(req);

        // info was called and threw, and errorRequest should have been called in the catch
        expect(mockedLogger.info).toHaveBeenCalled();
        expect(mockedLogger.errorRequest).toHaveBeenCalledTimes(1);
        const [passedReq, message] = mockedLogger.errorRequest.mock.calls[0];
        expect(passedReq).toBe(req);
        expect(message).toEqual(expect.stringContaining("CSRF debug logging failed: Error: test logger error"));
    });
});
