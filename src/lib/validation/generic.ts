// Only include methods that validate common entities and fields i.e. fields that are common to multiple forms across the service
// These methods are then called by individual form validators that extend this class
// Examples of fields common to multiple forms (to include in this class) are: email, username, phone number, postcode, gender, etc...

import errorManifest from "../utils/error_manifests/errorManifest";
import { z } from "zod";
import { ErrorSignature } from "../../types/errorSignature";

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

export function validateSearchString (str: string): boolean {
    const searchSchema = z.string()
        .trim().min(1);
    try {
        searchSchema.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

export function validatePageNumber (pageNum: number, arrayLength: number, perPage: number): boolean {
    let maxNumOfPages = 1;
    if (arrayLength) {
        maxNumOfPages = Math.ceil(arrayLength / perPage);
    }
    const pageNoSchema = z.number().min(1).max(maxNumOfPages);

    try {
        pageNoSchema.parse(pageNum);
        return true;
    } catch (e) {
        return false;
    }
}
