import { Request, Response } from "express";
import { RemoveThemselvesConfirmationHandler } from "../../../../../src/routers/handlers/yourCompanies/removeThemselvesConfirmationHandler";
import { removedThemselvesConfirmationControllerGet } from "../../../../../src/routers/controllers/removedThemselvesConfirmationController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/removeThemselvesConfirmationHandler", () => {
    return {
        RemoveThemselvesConfirmationHandler: jest.fn().mockImplementation(() => {
            return {
                execute: mockExecute
            };
        })
    };
});

const req: Request = mockRequest();
req.session = new Session();
const res: Response = mockResponse();
const renderMock = jest.fn();
res.render = renderMock;

describe("removedThemselvesConfirmationControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render removed themselves page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await removedThemselvesConfirmationControllerGet(req as Request, res as Response);
        // Then
        expect(RemoveThemselvesConfirmationHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.REMOVED_THEMSELVES, expectedViewData);
    });
});
