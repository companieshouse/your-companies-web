import { Request, Response } from "express";
import {
    ConfirmationPersonsDigitalAuthorisationCancelledHandler
} from "../../../../../src/routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationCancelledHandler";
import {
    confirmationPersonsDigitalAuthorisationCancelledControllerGet
} from "../../../../../src/routers/controllers/confirmationPersonsDigitalAuthorisationCancelledController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationCancelledHandler", () => {
    return {
        ConfirmationPersonsDigitalAuthorisationCancelledHandler: jest.fn().mockImplementation(() => {
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

describe("confirmationPersonsDigitalAuthorisationCancelledControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render person's digital authorisation cancelled success page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await confirmationPersonsDigitalAuthorisationCancelledControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmationPersonsDigitalAuthorisationCancelledHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_PAGE, expectedViewData);
    });
});
