import { validateCompanyNumberSearchString, validateEmailString, validatePageNumber } from "../../../../src/lib/validation/generic";

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

describe("validateCompanyNumberSearchString", () => {
    it("should return true if the search string is correct.", () => {
        // Given
        const searchString = "ABC";
        // When
        const result = validateCompanyNumberSearchString(searchString);
        // Then
        expect(result).toBeTruthy();
    });

    it("should false true if the search string is incorrect.", () => {
        // Given
        const searchString = "nald$%";
        // When
        const result = validateCompanyNumberSearchString(searchString);
        // Then
        expect(result).toBeFalsy();
    });

    it("should false true if the search string is empty.", () => {
        // Given
        const searchString = "";
        // When
        const result = validateCompanyNumberSearchString(searchString);
        // Then
        expect(result).toBeFalsy();
    });
});

describe("validatePageNumber", () => {
    it("should return true if page number within allowed range.", () => {
        // Given
        const pageNumber = 2;
        const maxNumOfPages = 8;
        // When
        const result = validatePageNumber(pageNumber, maxNumOfPages);
        // Then
        expect(result).toBeTruthy();
    });

    it("should return true if page number equals to lower bound of the allowed range.", () => {
        // Given
        const pageNumber = 1;
        const maxNumOfPages = 8;
        // When
        const result = validatePageNumber(pageNumber, maxNumOfPages);
        // Then
        expect(result).toBeTruthy();
    });

    it("should return true if page number equals to upper bound of the allowed range.", () => {
        // Given
        const pageNumber = 8;
        const maxNumOfPages = 8;
        // When
        const result = validatePageNumber(pageNumber, maxNumOfPages);
        // Then
        expect(result).toBeTruthy();
    });

    it("should return false if page number outside allowed range.", () => {
        // Given
        const pageNumber = 123;
        const maxNumOfPages = 8;
        // When
        const result = validatePageNumber(pageNumber, maxNumOfPages);
        // Then
        expect(result).toBeFalsy();
    });

    it("should return false if page number is negative.", () => {
        // Given
        const pageNumber = -5;
        const maxNumOfPages = 8;
        // When
        const result = validatePageNumber(pageNumber, maxNumOfPages);
        // Then
        expect(result).toBeFalsy();
    });

    it("should return false if page number the first lower than the lower bound of the allowed range.", () => {
        // Given
        const pageNumber = 0;
        const maxNumOfPages = 8;
        // When
        const result = validatePageNumber(pageNumber, maxNumOfPages);
        // Then
        expect(result).toBeFalsy();
    });

    it("should return false if page number is the first greater than the upper bound of the allowed range.", () => {
        // Given
        const pageNumber = 9;
        const maxNumOfPages = 8;
        // When
        const result = validatePageNumber(pageNumber, maxNumOfPages);
        // Then
        expect(result).toBeFalsy();
    });
});
