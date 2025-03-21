import { Request, Response } from "express";
import { CompanyAddSuccessHandler } from "../../../../../src/routers/handlers/yourCompanies/companyAddSuccessHandler";
import { companyAddedControllerGet } from "../../../../../src/routers/controllers/companyAddedController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/companyAddSuccessHandler", () => {
    return {
        CompanyAddSuccessHandler: jest.fn().mockImplementation(() => {
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
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");

describe("companyAddedControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render company add success page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await companyAddedControllerGet(req as Request, res as Response);
        // Then
        expect(CompanyAddSuccessHandler).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.COMPANY_ADD_SUCCESS_PAGE, expectedViewData);
    });
});
