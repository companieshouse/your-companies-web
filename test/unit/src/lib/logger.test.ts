import { Session } from "@companieshouse/node-session-handler";
import logger, { createAndLogError, createLogMessage } from "../../../../src/lib/Logger";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

logger.error = jest.fn();

describe("logger tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("logger", () => {
        it("should log an error message", () => {
            // Given
            const message = "test error message";
            // When
            logger.error(message);
            // Then
            expect(logger.error).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(message);
        });
    });

    describe("createAndLogError", () => {
        it("should log and return an error", () => {
            // Given
            const message = "something went wrong";
            // When
            const err: Error = createAndLogError(message);
            // Then
            expect(err.message).toEqual<string>(message);
            expect(logger.error).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(
                expect.stringContaining(message)
            );
        });

        it("should log and return an error with undefined message", () => {
            // Given
            const message: string = undefined as unknown as string;
            // When
            const err: Error = createAndLogError(message);
            // Then
            expect(err.message).toEqual<string>("");
            expect(logger.error).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(
                expect.stringContaining("createAndLogError")
            );
        });
    });

    describe("createLogMessage", () => {
        it("should return a log message with user ID", () => {
            // Given
            const userId = "12345";
            const session = {} as unknown as Session;
            const functionName = "testFunction";
            const message = "test message";
            const getLoggedInUserIdSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserId");
            getLoggedInUserIdSpy.mockReturnValueOnce(userId);
            // When
            const result = createLogMessage(session, functionName, message);
            // Then
            expect(result).toContain("Function: testFunction");
            expect(result).toContain("User ID: 12345");
            expect(result).toContain("Message: test message");
        });

        it("should return a log message with unknown user ID", () => {
            // Given
            const session = undefined;
            const functionName = "testFunction";
            const message = "test message";
            // When
            const result = createLogMessage(session, functionName, message);
            // Then
            expect(result).toContain("Function: testFunction");
            expect(result).toContain("User ID: unknown");
            expect(result).toContain("Message: test message");
        });
    });
});
