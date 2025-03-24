import { Request, Response } from "express";
import { RemoveCompanyConfirmedHandler } from "../../../../../src/routers/handlers/yourCompanies/removeCompanyConfirmedHandler";
import { removeCompanyConfirmedControllerGet } from "../../../../../src/routers/controllers/removeCompanyConfirmedController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/removeCompanyConfirmedHandler", () => {
    return {
        RemoveCompanyConfirmedHandler: jest.fn().mockImplementation(() => {
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

describe("removeCompanyConfirmedControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render remove company confirmed page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await removeCompanyConfirmedControllerGet(req as Request, res as Response);
        // Then
        expect(RemoveCompanyConfirmedHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.REMOVE_COMPANY_CONFIRMED, expectedViewData);
    });
});
