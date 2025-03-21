import { Request, Response } from "express";
import { AddCompanyHandler } from "../../../../../src/routers/handlers/yourCompanies/addCompanyHandler";
import { addCompanyControllerGet, addCompanyControllerPost } from "../../../../../src/routers/controllers/addCompanyController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/addCompanyHandler", () => {
    return {
        AddCompanyHandler: jest.fn().mockImplementation(() => {
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
const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");

describe("addCompanyControllerGet", () => {

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
        await addCompanyControllerGet(req as Request, res as Response);
        // Then
        expect(AddCompanyHandler).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.ADD_COMPANY_PAGE, expectedViewData);
    });
});

describe("addCompanyControllerPost", () => {

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
            await addCompanyControllerPost(req as Request, res as Response);
            // Then
            expect(AddCompanyHandler).toHaveBeenCalledTimes(1);
            expect(renderMock).toHaveBeenCalledTimes(1);
            expect(renderMock).toHaveBeenCalledWith(constants.ADD_COMPANY_PAGE, expectedViewData);
        });

    it("should redirect to confirm company details page if an error does not present in view data",
        async () => {
            // Given
            const expectedViewData = {
                key: "value"
            };
            mockExecute.mockReturnValue(expectedViewData);
            // When
            await addCompanyControllerPost(req as Request, res as Response);
            // Then
            expect(AddCompanyHandler).toHaveBeenCalledTimes(1);
            expect(redirectMock).toHaveBeenCalledTimes(1);
            expect(redirectMock).toHaveBeenCalledWith(`${constants.LANDING_URL}${constants.CONFIRM_COMPANY_DETAILS_URL}`);
        });
});
