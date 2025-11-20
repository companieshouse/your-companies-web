import { GenericHandler } from "../../../../../src/routers/handlers/genericHandler";
import { ErrorSignature } from "../../../../../src/types/errorSignature";
import errorManifest from "../../../../../src/lib/utils/error_manifests/errorManifest";

describe("GenericHandler", () => {
    test.each([
        {
            returnInfo: "error stack",
            errorName: "VALIDATION_ERRORS",
            errorStack: "ValidationError: Validation failed\nat Validator (eval at <anonymous>, <anonymous>:11:15)",
            expectedReturnValue: "ValidationError: Validation failed\nat Validator (eval at <anonymous>, <anonymous>:11:15)"
        },
        {
            returnInfo: "generic server error",
            errorName: "SOME_OTHER_ERROR",
            errorStack: "SomeOtherError: Someththing failed\nat Function (eval at <anonymous>, <anonymous>:22:19)",
            expectedReturnValue: { serverError: errorManifest.generic.serverError }
        }
    ])("should return $returnInfo when error name is $errorName",
       ({ errorName, errorStack, expectedReturnValue }) => {
           // Given
           const genericHandler = new GenericHandler();
           const error: ErrorSignature = {
               status: 400,
               name: errorName,
               message: "This is a test error",
               stack: errorStack
           };
           // When
           const result = genericHandler.processHandlerException(error);
           // Then
           expect(result).toEqual(expectedReturnValue);
       });
});
