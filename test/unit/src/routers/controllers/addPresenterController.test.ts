import { Request, Response } from "express";
import { AddPresenterHandler } from "../../../../../src/routers/handlers/yourCompanies/addPresenterHandler";
import { addPresenterControllerGet, addPresenterControllerPost } from "../../../../../src/routers/controllers/addPresenterController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/addPresenterHandler", () => {
    return {
        AddPresenterHandler: jest.fn().mockImplementation(() => {
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
const getCheckPresenterFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getCheckPresenterFullUrl");

describe("addPresenterControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render add presenter page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await addPresenterControllerGet(req as Request, res as Response);
        // Then
        expect(AddPresenterHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.ADD_PRESENTER_PAGE, expectedViewData);
    });
});

describe("addPresenterControllerPost", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render add company page if an error present in view data",
       async () => {
           // Given
           const expectedViewData = {
               errors: [
                   { key: "value" }
               ]
           };
           mockExecute.mockReturnValue(expectedViewData);
           // When
           await addPresenterControllerPost(req as Request, res as Response);
           // Then
           expect(AddPresenterHandler).toHaveBeenCalledTimes(1);
           expect(renderMock).toHaveBeenCalledTimes(1);
           expect(renderMock).toHaveBeenCalledWith(constants.ADD_PRESENTER_PAGE, expectedViewData);
       });

    it("should redirect to confirm company details page if an error does not present in view data",
       async () => {
           // Given
           const expectedViewData = {
               companyNumber: "12345"
           };
           mockExecute.mockReturnValue(expectedViewData);
           const expectedUrl = "/test/test-url";
           getCheckPresenterFullUrlSpy.mockReturnValue(expectedUrl);
           // When
           await addPresenterControllerPost(req as Request, res as Response);
           // Then
           expect(AddPresenterHandler).toHaveBeenCalledTimes(1);
           expect(getCheckPresenterFullUrlSpy).toHaveBeenCalledTimes(1);
           expect(getCheckPresenterFullUrlSpy).toHaveBeenCalledWith(expectedViewData.companyNumber);
           expect(redirectMock).toHaveBeenCalledTimes(1);
           expect(redirectMock).toHaveBeenCalledWith(expectedUrl);
       });
});
