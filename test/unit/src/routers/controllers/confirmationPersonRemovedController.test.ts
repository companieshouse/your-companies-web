import { Request, Response } from "express";
import {
    ConfirmationPersonRemovedHandler
} from "../../../../../src/routers/handlers/yourCompanies/confirmationPersonRemovedHandler";
import {
    confirmationPersonRemovedControllerGet
} from "../../../../../src/routers/controllers/confirmationPersonRemovedController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmationPersonRemovedHandler", () => {
    return {
        ConfirmationPersonRemovedHandler: jest.fn().mockImplementation(() => {
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

describe("confirmationPersonRemovedControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render person removed success page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await confirmationPersonRemovedControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmationPersonRemovedHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRMATION_PERSON_REMOVED_PAGE, expectedViewData);
    });
});
