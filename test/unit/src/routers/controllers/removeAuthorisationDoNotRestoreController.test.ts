import { Request, Response } from "express";
import { removeAuthorisationDoNotRestoreControllerGet } from "../../../../../src/routers/controllers/removeAuthorisationDoNotRestoreController";
import { RemoveAuthorisationDoNotRestoreHandler } from "../../../../../src/routers/handlers/yourCompanies/removeAuthorisationDoNotRestoreHandler";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/removeAuthorisationDoNotRestoreHandler", () => {
    return {
        RemoveAuthorisationDoNotRestoreHandler: jest.fn().mockImplementation(() => {
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

describe("removeAuthorisationDoNotRestoreControllerGet", () => {

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
        await removeAuthorisationDoNotRestoreControllerGet(req as Request, res as Response);
        // Then
        expect(RemoveAuthorisationDoNotRestoreHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE, expectedViewData);
    });
});
