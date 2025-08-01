import { Request, Response } from "express";
import {
    ConfirmationAuthorisationEmailResentHandler
} from "../../../../../src/routers/handlers/yourCompanies/confirmationAuthorisationEmailResentHandler";
import {
    confirmationAuthorisationEmailResentControllerGet
} from "../../../../../src/routers/controllers/confirmationAuthorisationEmailResentController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmationAuthorisationEmailResentHandler", () => {
    return {
        ConfirmationAuthorisationEmailResentHandler: jest.fn().mockImplementation(() => {
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

describe("confirmationAuthorisationEmailResentControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render authorisation email resent success page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await confirmationAuthorisationEmailResentControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmationAuthorisationEmailResentHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_PAGE, expectedViewData);
    });
});
