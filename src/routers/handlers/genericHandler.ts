// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import { ViewData } from "../../types/util-types";
import errorManifest from "../../lib/utils/error_manifests/errorManifest";
import { ErrorSignature } from "../../types/errorSignature";

export class GenericHandler {

    viewData: ViewData;
    errorManifest: any;

    constructor () {
        this.errorManifest = errorManifest;
        this.viewData = {
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
