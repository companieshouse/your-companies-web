import { Request, Response } from "express";
import { confirmationAuthorisationRemovedControllerGet } from "../../../../../src/routers/controllers/confirmationAuthorisationRemovedController";
import { ConfirmationAuthorisationRemovedHandler } from "../../../../../src/routers/handlers/yourCompanies/confirmationAuthorisationRemovedHandler";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmationAuthorisationRemovedHandler", () => {
    return {
        ConfirmationAuthorisationRemovedHandler: jest.fn().mockImplementation(() => {
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
const redirectMock = jest.fn();
res.redirect = redirectMock;

describe("confirmationAuthorisationRemovedControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render add company page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await confirmationAuthorisationRemovedControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmationAuthorisationRemovedHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRMATION_AUTHORISATION_REMOVED_PAGE, expectedViewData);
    });
});
