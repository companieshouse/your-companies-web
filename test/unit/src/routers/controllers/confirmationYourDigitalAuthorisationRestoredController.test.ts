import { Request, Response } from "express";
import {
    ConfirmationYourDigitalAuthorisationRestoredHandler
} from "../../../../../src/routers/handlers/yourCompanies/confirmationYourDigitalAuthorisationRestoredHandler";
import {
    confirmationYourDigitalAuthorisationRestoredControllerGet
} from "../../../../../src/routers/controllers/confirmationYourDigitalAuthorisationRestoredController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmationYourDigitalAuthorisationRestoredHandler", () => {
    return {
        ConfirmationYourDigitalAuthorisationRestoredHandler: jest.fn().mockImplementation(() => {
            return {
                execute: mockExecute
            };
        })
    };
});
jest.mock("../../../../../src/lib/Logger");

const req: Request = mockRequest();
req.session = new Session();
const res: Response = mockResponse();
const renderMock = jest.fn();
res.render = renderMock;

describe("confirmationYourDigitalAuthorisationRestoredControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render your digital authorisation restored success page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await confirmationYourDigitalAuthorisationRestoredControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmationYourDigitalAuthorisationRestoredHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE, expectedViewData);
    });
});
