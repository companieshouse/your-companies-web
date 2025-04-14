import { BaseViewData } from "../../types/utilTypes";
import errorManifest from "../../lib/utils/error_manifests/errorManifest";
import { ErrorSignature } from "../../types/errorSignature";

/**
 * GenericHandler serves as the base class for all route handlers.
 * It provides common methods and properties shared across multiple handlers.
 */
export class GenericHandler {
    viewData: BaseViewData;
    errorManifest: any;

    /**
     * Initializes the GenericHandler with default view data and error manifest.
     */
    constructor () {
        this.errorManifest = errorManifest;
        this.viewData = {
            templateName: "",
            errors: {},
            lang: {}
        };
    }

    /**
     * Processes exceptions thrown within handlers.
     *
     * @param err - The error signature object containing error details.
     * @returns Processed error information, either a stack trace for validation errors
     *          or a generic server error message.
     */
    processHandlerException (err: ErrorSignature): unknown {
        if (err.name === "VALIDATION_ERRORS") {
            return err.stack;
        }
        return {
            serverError: this.errorManifest.generic.serverError
        };
    }
}
