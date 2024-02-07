import logger, { createAndLogError } from "../../../src/lib/Logger";

logger.error = jest.fn();

describe("logger tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createAndLogError tests", () => {
        it("Should log and return an error", () => {
            const message = "something went wrong";
            const err: Error = createAndLogError(message);

            expect(err.message).toEqual<string>(message);
            expect(logger.error).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(
                expect.stringContaining(message)
            );
        });

        it("Should log and return an error with undefined message", () => {
            const message: string = undefined as unknown as string;
            const err: Error = createAndLogError(message);

            expect(err.message).toEqual<string>("");
            expect(logger.error).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(
                expect.stringContaining("createAndLogError")
            );
        });
    });
});
