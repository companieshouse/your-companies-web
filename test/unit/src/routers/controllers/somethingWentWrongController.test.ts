import { Request, Response } from "express";
import { SomethingWentWrongHandler } from "../../../../../src/routers/handlers/yourCompanies/somethingWentWrongHandler";
import { somethingWentWrongControllerGet } from "../../../../../src/routers/controllers/somethingWentWrongController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/somethingWentWrongHandler", () => {
    return {
        SomethingWentWrongHandler: jest.fn().mockImplementation(() => {
            return {
                execute: mockExecute
            };
        })
    };
});

const req: Request = mockRequest();
req.session = new Session();
const res: Response = mockResponse();
const renderMock = jest.fn(() => res);
res.render = renderMock;
const statusMock = jest.fn(() => res);
res.status = statusMock;

describe("somethingWentWrongControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render service unavailable page", async () => {
        // Given
        const expectedViewData = {
            csrfErrors: true,
            lang: {},
            title: "",
            templateName: constants.SERVICE_UNAVAILABLE_TEMPLATE
        };

        mockExecute.mockReturnValue(expectedViewData);
        // When
        await somethingWentWrongControllerGet(req as Request, res as Response);
        // Then
        expect(SomethingWentWrongHandler).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(403);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.SERVICE_UNAVAILABLE_TEMPLATE, expectedViewData);
    });

    it("should render with status 500 if not a CSRF error", async () => {
        const expectedViewData = {
            csrfErrors: false,
            lang: {},
            title: "",
            templateName: constants.SERVICE_UNAVAILABLE_TEMPLATE
        };

        mockExecute.mockReturnValue(expectedViewData);
        await somethingWentWrongControllerGet(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(renderMock).toHaveBeenCalledWith(constants.SERVICE_UNAVAILABLE_TEMPLATE, expectedViewData);
    });

});
