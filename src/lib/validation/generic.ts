// Only include methods that validate common entities and fields i.e. fields that are common to multiple forms across the service
// These methods are then called by individual form validators that extend this class
// Examples of fields common to multiple forms (to include in this class) are: email, username, phone number, postcode, gender, etc...

import errorManifest from "../utils/error_manifests/errorManifest";
import { z } from "zod";
import { ErrorSignature } from "../../types/errorSignature";
import * as constants from "../../constants";

export class GenericValidator {

    errors: unknown;
    payload: unknown;
    errorManifest: unknown;

    constructor () {
        this.errors = this.getErrorSignature();
        this.errorManifest = errorManifest;
    }

    protected getErrorSignature (): ErrorSignature {
        return {
            status: 400,
            name: "VALIDATION_ERRORS",
            message: errorManifest.validation.default.summary,
            stack: {}
        };
    }
}

export function validateEmailString (emailString: string): boolean {
    const emailSchema = z.string().email();
    try {
        emailSchema.parse(emailString);
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

export function validateClearForm (clearForm: string): boolean {

    const clearFormSchema = z.literal("true");

    try {
        clearFormSchema.parse(clearForm);
        return true;
    } catch (e) {
        return false;
    }
}
