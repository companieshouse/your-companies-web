// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import { BaseViewData } from "../../types/utilTypes";
import errorManifest from "../../lib/utils/error_manifests/errorManifest";
import { ErrorSignature } from "../../types/errorSignature";

export class GenericHandler {

    viewData: BaseViewData;
    errorManifest: any;

    constructor () {
        this.errorManifest = errorManifest;
        this.viewData = {
            templateName: "",
            errors: {},
            lang: {}
        };
    }

    processHandlerException (err: ErrorSignature): unknown {
        if (err.name === "VALIDATION_ERRORS") {
            return err.stack;
        }
        return {
            serverError: this.errorManifest.generic.serverError
        };
    }
}
