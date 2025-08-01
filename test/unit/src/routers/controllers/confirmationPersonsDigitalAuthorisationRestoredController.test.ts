import { Request, Response } from "express";
import {
    ConfirmationPersonsDigitalAuthorisationRestoredHandler
} from "../../../../../src/routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationRestoredHandler";
import {
    confirmationPersonsDigitalAuthorisationRestoredControllerGet
} from "../../../../../src/routers/controllers/confirmationPersonsDigitalAuthorisationRestoredController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationRestoredHandler", () => {
    return {
        ConfirmationPersonsDigitalAuthorisationRestoredHandler: jest.fn().mockImplementation(() => {
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

describe("confirmationPersonsDigitalAuthorisationRestoredControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render person's digital authorisation restored success page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await confirmationPersonsDigitalAuthorisationRestoredControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmationPersonsDigitalAuthorisationRestoredHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_PAGE, expectedViewData);
    });
});
