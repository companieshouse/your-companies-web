import { Request, Response } from "express";
import {
    ConfirmationPersonAddedHandler
} from "../../../../../src/routers/handlers/yourCompanies/confirmationPersonAddedHandler";
import {
    confirmationPersonAddedControllerGet
} from "../../../../../src/routers/controllers/confirmationPersonAddedController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmationPersonAddedHandler", () => {
    return {
        ConfirmationPersonAddedHandler: jest.fn().mockImplementation(() => {
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

describe("confirmationPersonAddedControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render person added success page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await confirmationPersonAddedControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmationPersonAddedHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRMATION_PERSON_ADDED_PAGE, expectedViewData);
    });
});
