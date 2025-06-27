import { Request, Response } from "express";
import { ManageAuthorisedPeopleHandler } from "../../../../../src/routers/handlers/yourCompanies/manageAuthorisedPeopleHandler";
import { manageAuthorisedPeopleControllerGet } from "../../../../../src/routers/controllers/manageAuthorisedPeopleController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/manageAuthorisedPeopleHandler", () => {
    return {
        ManageAuthorisedPeopleHandler: jest.fn().mockImplementation(() => {
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
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");

describe("manageAuthorisedPeopleControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render manage authorised people page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        const companyNumber = "12345";
        getExtraDataSpy.mockReturnValue(companyNumber);
        // When
        await manageAuthorisedPeopleControllerGet(req as Request, res as Response);
        // Then
        expect(ManageAuthorisedPeopleHandler).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.REMOVE_URL_EXTRA);
        expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.COMPANY_NUMBER);
        expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, companyNumber);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_PAGE, expectedViewData);
    });
});
