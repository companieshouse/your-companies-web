import { toCamelCase } from "../../../../src/lib/utils/transformationUtils";

describe("toCamelCase", () => {
    it("should return an object with key in camel case if an object with keys in snake case provided", () => {
        // Given
        const snakeCaseKeysObj = {
            first_key: "first value",
            second_key: 22,
            third_key: null,
            key_1: undefined,
            key: true
        };
        const expectedCamelCaseKeysObj = {
            firstKey: "first value",
            secondKey: 22,
            thirdKey: null,
            key1: undefined,
            key: true
        };
        // When
        const result = toCamelCase(snakeCaseKeysObj);
        // Then
        expect(result).toEqual(expectedCamelCaseKeysObj);
    });

    it("should return a nested object with key in camel case if a nested object with keys in snake case provided", () => {
        // Given
        const snakeCaseKeysObj = {
            first_key: "first value",
            second_key: [
                {
                    nested_key: "nested value"
                }
            ],
            third_key: {
                nested_key: "nested value"
            }
        };
        const expectedCamelCaseKeysObj = {
            firstKey: "first value",
            secondKey: [
                {
                    nestedKey: "nested value"
                }
            ],
            thirdKey: {
                nestedKey: "nested value"
            }
        };
        // When
        const result = toCamelCase(snakeCaseKeysObj);
        // Then
        expect(result).toEqual(expectedCamelCaseKeysObj);
    });
});
