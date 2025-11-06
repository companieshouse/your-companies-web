import { getEnvironmentValue } from "../../../../../src/lib/utils/environmentValue";

describe("getEnvironmentValue", () => {
    const oldEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...oldEnv };
        process.env.TEST_ENV_VARIABLE = "expected value";
    });

    afterAll(() => {
        process.env = oldEnv;
    });

    test.each([
        // Given
        {
            returnInfo: "an environment value",
            condition: "set for the provided key",
            key: "TEST_ENV_VARIABLE",
            expectedValue: "expected value"
        },
        {
            returnInfo: "an empty string",
            condition: "the environment value not set for the provided key",
            key: "TEST_ENV_VARIABLE_OTHER",
            expectedValue: ""
        },
        {
            returnInfo: "an empty string",
            condition: "the key not provided",

            key: undefined!,
            expectedValue: ""
        }
    ])("should return $returnInfo if $condition",
       ({ key, expectedValue }) => {
           // When
           const result = getEnvironmentValue(key);
           // Then
           expect(result).toEqual(expectedValue);
       });
});
