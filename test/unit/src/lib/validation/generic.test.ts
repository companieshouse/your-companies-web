import {
    validateCompanyNumberSearchString,
    validateFullCompanyNumberSearchString,
    validateEmailString,
    validatePageNumber,
    validateClearForm
} from "../../../../../src/lib/validation/generic";

describe("Should validate emails", () => {
    it.each([
        { email: "", expected: false },
        { email: "a@a.", expected: true },
        { email: "a@b", expected: false },
        { email: "undefined", expected: false },
        { email: "12345", expected: false },
        { email: "234567890@example.com", expected: true },
        { email: "email@example-one.com", expected: true },
        { email: "_______@example.com", expected: true },
        { email: "hu.lk!mar#vel+@example.com", expected: true },
        { email: "hu$lkm%ar&vel@example.com", expected: true },
        { email: "+hul'kmar*vel@example.com", expected: true },
        { email: "hu=lkm?ar^vel@example.com", expected: true },
        { email: "hu_lkmar`ve{l@example.com", expected: true },
        { email: "h|ulkm}arv~el@example.com", expected: true },
        { email: "h.u!l#k$m%a&r'v*e+l/2=1?m^c_u`n{i|v}e~rs-e@example.com", expected: true },
        { email: "h.u!l#k$m%a&r'v*e+l/2=1?m^c_u`n{i|v}e~rs-eexample.com", expected: false },
        { email: "anystring", expected: false }
    ])("should return $expected for $email", ({ email, expected }) => {
        expect(validateEmailString(email)).toEqual(expected);
    });
});

describe("validateFullCompanyNumberSearchString", () => {
    test.each([
        // Given
        { returnValue: true, condition: "the search string is correct", searchString: "ABC1234" },
        { returnValue: false, condition: "the search string has invalid chars", searchString: "nald$%" },
        { returnValue: false, condition: "the search string is empty", searchString: "" },
        { returnValue: false, condition: "the search string is only 5 char", searchString: "A1234" },
        { returnValue: false, condition: "the search string is greater than 10 char", searchString: "AB123456789" }
    ])("should return $returnValue if $condition", ({ returnValue, searchString }) => {
        // When
        const result = validateFullCompanyNumberSearchString(searchString);
        // Then
        expect(result).toEqual(returnValue);
    });
});

describe("validateCompanyNumberSearchString", () => {
    test.each([
        // Given
        { returnValue: true, condition: "the search string is correct", searchString: "ABC" },
        { returnValue: false, condition: "the search string is incorrect", searchString: "nald$%" },
        { returnValue: false, condition: "the search string is empty", searchString: "" },
        { returnValue: false, condition: "the search string is empty", searchString: "" }
    ])("should return $returnValue if $condition", ({ returnValue, searchString }) => {
        // When
        const result = validateCompanyNumberSearchString(searchString);
        // Then
        expect(result).toEqual(returnValue);
    });
});

describe("validatePageNumber", () => {
    test.each([
        // Given
        {
            returnValue: true,
            condition: "page number within allowed range",
            pageNumber: 2,
            maxNumOfPages: 8
        },
        {
            returnValue: true,
            condition: "page number equals to lower bound of the allowed range",
            pageNumber: 1,
            maxNumOfPages: 8
        },
        {
            returnValue: true,
            condition: "page number equals to upper bound of the allowed range",
            pageNumber: 8,
            maxNumOfPages: 8
        },
        {
            returnValue: false,
            condition: "page number outside allowed range",
            pageNumber: 123,
            maxNumOfPages: 8
        },
        {
            returnValue: false,
            condition: "page number is negative",
            pageNumber: -5,
            maxNumOfPages: 8
        },
        {
            returnValue: false,
            condition: "page number the first lower than the lower bound of the allowed range",
            pageNumber: 0,
            maxNumOfPages: 8
        },
        {
            returnValue: false,
            condition: "page number is the first greater than the upper bound of the allowed range",
            pageNumber: 9,
            maxNumOfPages: 8
        }
    ])("should return $returnValue if $condition",
       ({ returnValue, pageNumber, maxNumOfPages }) => {
           // When
           const result = validatePageNumber(pageNumber, maxNumOfPages);
           // Then
           expect(result).toEqual(returnValue);
       });
});

describe("Should validate clear form query param", () => {
    it.each([
        { string: "true", expected: true },
        { string: "false", expected: false },
        { string: "truex", expected: false },
        { string: "undefined", expected: false }
    ])("should return $expected for $email", ({ string, expected }) => {
        expect(validateClearForm(string)).toEqual(expected);
    });
});
