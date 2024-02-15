import { GenericValidator, validateEmailString } from "../../../../src/lib/validation/generic";

describe("Validate email address", () => {
    const validator = new GenericValidator();

    it("should return false if input is not a valid email address", () => {
        // Given
        const emailAddress = "test@test";
        // When
        const isEmailAddress = validator.isValidEmail(emailAddress);
        // Then
        expect(isEmailAddress).toBeFalsy();
    });
});

describe("Should validate emails", () => {
    it.each([
        { email: "", expected: false },
        { email: "a@a.", expected: false },
        { email: "a@b", expected: false },
        { email: "undefined", expected: false },
        { email: "12345", expected: false },
        { email: "j@j.c", expected: true },
        { email: "email@123.123.123.123", expected: true },
        { email: "email@[123.123.123.123]", expected: true },
        { email: "“email”@example.com", expected: true },
        { email: "234567890@example.com", expected: true },
        { email: "email@example-one.com", expected: true },
        { email: "_______@example.com", expected: true }
    ])("should return $expected for $email", ({ email, expected }) => {
        expect(validateEmailString(email)).toEqual(expected);
    });
});
