import { Request, Response } from "express";
import {
    ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler
} from "../../../../../src/routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler";
import {
    confirmationPersonsDigitalAuthorisationRemovedNotRestoredControllerGet
} from "../../../../../src/routers/controllers/confirmationPersonsDigitalAuthorisationRemovedNotRestoredController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler", () => {
    return {
        ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler: jest.fn().mockImplementation(() => {
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

describe("confirmationPersonsDigitalAuthorisationRemovedNotRestoredControllerGet", () => {

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
        await confirmationPersonsDigitalAuthorisationRemovedNotRestoredControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_PAGE, expectedViewData);
    });
});
