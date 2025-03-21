import { Request, Response } from "express";
import { PresenterAlreadyAddedHandler } from "../../../../../src/routers/handlers/yourCompanies/presenterAlreadyAddedHandler";
import { presenterAlreadyAddedControllerGet } from "../../../../../src/routers/controllers/presenterAlreadyAddedController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/presenterAlreadyAddedHandler", () => {
    return {
        PresenterAlreadyAddedHandler: jest.fn().mockImplementation(() => {
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

describe("presenterAlreadyAddedControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render presenter already added page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await presenterAlreadyAddedControllerGet(req as Request, res as Response);
        // Then
        expect(PresenterAlreadyAddedHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.PRESENTER_ALREADY_ADDED_PAGE, expectedViewData);
    });
});
