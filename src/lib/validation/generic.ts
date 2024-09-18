import { z } from "zod";
import * as constants from "../../constants";

export function validateEmailString (emailString: string): boolean {
    const emailSchema = z.string().email();
    try {
        emailSchema.parse(emailString);
        return true;
    } catch (e) {
        return false;
    }
}

export function validateClearForm (clearForm: string): boolean {

    const clearFormSchema = z.literal("true");

    try {
        clearFormSchema.parse(clearForm);
        return true;
    } catch (e) {
        return false;
    }
}

export function validateCompanyNumberSearchString (str: string): boolean {
    const searchSchema = z.string()
        .trim().regex(constants.COMPANY_NUMBER_SEARCH_VALIDATION_REGEX);
    try {
        searchSchema.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

export function validatePageNumber (pageNum: number, maxNumOfPages: number): boolean {
    const pageNoSchema = z.number().min(1).max(maxNumOfPages);

    try {
        pageNoSchema.parse(pageNum);
        return true;
    } catch (e) {
        return false;
    }
}
