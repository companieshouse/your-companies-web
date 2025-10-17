import { z } from "zod";
import * as constants from "../../constants";

/**
 * Validates if the given string is a valid email address.
 * @param emailString - The email string to validate.
 * @returns True if the email is valid, otherwise false.
 */
export function validateEmailString (emailString: string): boolean {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([^.@][^@\s]+)$/;
    const emailSchema = z.string().regex(regex);

    try {
        emailSchema.parse(emailString);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Validates if the given string is the literal "true".
 * @param clearForm - The string to validate.
 * @returns True if the string is "true", otherwise false.
 */
export function validateClearForm (clearForm: string): boolean {
    const clearFormSchema = z.literal("true");
    try {
        clearFormSchema.parse(clearForm);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Validates if the given string matches the company number search format.
 * @param str - The string to validate.
 * @returns True if the string matches the regex, otherwise false.
 */
export function validateCompanyNumberSearchString (str: string): boolean {
    const searchSchema = z.string()
        .trim()
        .regex(constants.COMPANY_NUMBER_SEARCH_VALIDATION_REGEX);
    try {
        searchSchema.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Validates if the given string matches the company number search format.
 * This uses the full 6-10 char regex.
 * @param str - The string to validate.
 * @returns True if the string matches the regex, otherwise false.
 */
export function validateFullCompanyNumberSearchString (str: string): boolean {
    const searchSchema = z.string()
        .trim()
        .regex(constants.COMPANY_NUMBER_FULL_SEARCH_VALIDATION_REGEX);
    try {
        searchSchema.parse(str);
        return true;
    } catch (e) {
        return false;
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
        .min(1)
        .max(maxNumOfPages);
    try {
        pageNoSchema.parse(pageNum);
        return true;
    } catch (e) {
        return false;
    }
}
