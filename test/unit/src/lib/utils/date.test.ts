/* eslint-disable import/first */
jest.mock("../../../../../src/lib/Logger");

import {
    isOlderThan,
    toReadableFormat
} from "../../../../../src/lib/utils/date";
import { createAndLogError } from "../../../../../src/lib/Logger";
import { Settings as luxonSettings } from "luxon";

const mockCreateAndLogError = createAndLogError as jest.Mock;
mockCreateAndLogError.mockReturnValue(new Error());

const today = "2020-04-25";

describe("Date tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        luxonSettings.now = () => new Date(today).valueOf();
    });

    describe("toReadableFormat tests", () => {
        test.each([
            // Given
            {
                returnInfo: "a human readable date",
                condition: "hyphanated-date string provided",
                input: "2019-03-01",
                expectedString: "1 March 2019"
            },
            {
                returnInfo: "a human readable date",
                condition: "local string provided",
                input: "March 18, 2019",
                expectedString: "18 March 2019"
            },
            {
                returnInfo: "empty string",
                condition: "date is undefined",
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                input: undefined!,
                expectedString: ""
            },
            {
                returnInfo: "empty string",
                condition: "date is null",
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                input: null!,
                expectedString: ""
            },
            {
                returnInfo: "empty string",
                condition: "date is empty string",
                input: "",
                expectedString: ""
            }
        ])("should return $returnInfo if $condition",
            ({ input, expectedString }) => {
                // When
                const date = toReadableFormat(input);
                // Then
                expect(date).toEqual(expectedString);
            });

        it("Should log and throw an error", () => {
            // Given
            const badDate = "12345/44/44";
            // Then
            expect(() => toReadableFormat(badDate)).toThrow(Error);
            expect(mockCreateAndLogError).toHaveBeenCalledWith(
                expect.stringContaining(badDate)
            );

        });
    });

    describe("isOlderThan", () => {
        it("should return true if the provided date is older than the provided number of days from now", () => {
            // Given
            const dateToVerify = "2024-04-30";
            const numberOfDays = 7;
            // When
            const result = isOlderThan(dateToVerify, numberOfDays);
            // Then
            expect(result).toBeTruthy();
        });

        it("should return false if the provided date is not older than the provided number of days from now", () => {
            // Given
            const dateToVerify = new Date().toString();
            const numberOfDays = 7;
            // When
            const result = isOlderThan(dateToVerify, numberOfDays);
            // Then
            expect(result).toBeFalsy();
        });
    });
});
