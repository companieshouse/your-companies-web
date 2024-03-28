import { validateEmailString, validateSearchString, validatePageNumber } from "../../../../src/lib/validation/generic";

describe("Should validate emails", () => {
    it.each([
        { email: "", expected: false },
        { email: "a@a.", expected: false },
        { email: "a@b", expected: false },
        { email: "undefined", expected: false },
        { email: "12345", expected: false },
        { email: "234567890@example.com", expected: true },
        { email: "email@example-one.com", expected: true },
        { email: "_______@example.com", expected: true },
        { email: "bob@e@xample.com", expected: false }
    ])("should return $expected for $email", ({ email, expected }) => {
        expect(validateEmailString(email)).toEqual(expected);
    });
});

describe("Should validate search string", () => {
    it.each([
        { search: "", expected: false },
        { search: "a", expected: true },
        { search: "1", expected: true }
    ])("should return $expected for $search", ({ search, expected }) => {
        expect(validateSearchString(search)).toEqual(expected);
    });
});

describe("Should validate page number", () => {
    it.each([
        { page: 1, results: 54, perPage: 15, expected: true },
        { page: 3, results: 45, perPage: 15, expected: true },
        { page: 14, results: 24, perPage: 15, expected: false },
        { page: -1, results: 200, perPage: 15, expected: false },
        { page: 0, results: 4, perPage: 15, expected: false }
    ])("should return $expected for $page when max num is $max", ({ page, results, perPage, expected }) => {
        expect(validatePageNumber(page, results, perPage)).toEqual(expected);
    });
});
