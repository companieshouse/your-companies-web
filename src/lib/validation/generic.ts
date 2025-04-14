import { z } from "zod";
import * as constants from "../../constants";

/**
 * Validates if the given string is a valid email address.
 * @param emailString - The email string to validate.
 * @returns True if the email is valid, otherwise false.
 */
export function validateEmailString (emailString: string): boolean {
    const emailSchema = z.string().email(); // Define a schema for a valid email string.
    try {
        emailSchema.parse(emailString); // Validate the email string against the schema.
        return true;
    } catch (e) {
        return false; // Return false if validation fails.
    }
}

/**
 * Validates if the given string is the literal "true".
 * @param clearForm - The string to validate.
 * @returns True if the string is "true", otherwise false.
 */
export function validateClearForm (clearForm: string): boolean {
    const clearFormSchema = z.literal("true"); // Define a schema for the literal string "true".
    try {
        clearFormSchema.parse(clearForm); // Validate the string against the schema.
        return true;
    } catch (e) {
        return false; // Return false if validation fails.
    }
}

/**
 * Validates if the given string matches the company number search format.
 * @param str - The string to validate.
 * @returns True if the string matches the regex, otherwise false.
 */
export function validateCompanyNumberSearchString (str: string): boolean {
    const searchSchema = z.string()
        .trim() // Remove leading and trailing whitespace.
        .regex(constants.COMPANY_NUMBER_SEARCH_VALIDATION_REGEX); // Match against a predefined regex.
    try {
        searchSchema.parse(str); // Validate the string against the schema.
        return true;
    } catch (e) {
        return false; // Return false if validation fails.
    }
}

/**
 * Validates if the given page number is within the valid range.
 * @param pageNum - The page number to validate.
 * @param maxNumOfPages - The maximum allowed page number.
 * @returns True if the page number is valid, otherwise false.
 */
export function validatePageNumber (pageNum: number, maxNumOfPages: number): boolean {
    const pageNoSchema = z.number()
        .min(1) // Minimum page number is 1.
        .max(maxNumOfPages); // Maximum page number is the provided maxNumOfPages.
    try {
        pageNoSchema.parse(pageNum); // Validate the page number against the schema.
        return true;
    } catch (e) {
        return false; // Return false if validation fails.
    }
}
