import { Request, Response } from "express";
import { RemoveCompanyHandler } from "../../../../../src/routers/handlers/yourCompanies/removeCompanyHandler";
import { removeCompanyControllerGet, removeCompanyControllerPost } from "../../../../../src/routers/controllers/removeCompanyController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/removeCompanyHandler", () => {
    return {
        RemoveCompanyHandler: jest.fn().mockImplementation(() => {
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

describe("removeCompanyControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render remove company page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await removeCompanyControllerGet(req as Request, res as Response);
        // Then
        expect(RemoveCompanyHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.REMOVE_COMPANY_PAGE, expectedViewData);
    });
});

describe("removeCompanyControllerPost", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render remove company page if an error present in view data",
       async () => {
           // Given
           const expectedViewData = {
               errors: [
                   { key: "value" }
               ]
           };
           mockExecute.mockReturnValue(expectedViewData);
           // When
           await removeCompanyControllerPost(req as Request, res as Response);
           // Then
           expect(RemoveCompanyHandler).toHaveBeenCalledTimes(1);
           expect(renderMock).toHaveBeenCalledTimes(1);
           expect(renderMock).toHaveBeenCalledWith(constants.REMOVE_COMPANY_PAGE, expectedViewData);
       });
});
