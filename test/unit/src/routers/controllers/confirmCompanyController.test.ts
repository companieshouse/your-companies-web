import { Request, Response } from "express";
import { ConfirmCorrectCompanyHandler } from "../../../../../src/routers/handlers/yourCompanies/confirmCorrectCompanyHandler";
import { confirmCompanyControllerGet, confirmCompanyControllerPost } from "../../../../../src/routers/controllers/confirmCompanyController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";
import { Session } from "@companieshouse/node-session-handler";
import { validActiveCompanyProfile } from "../../../../mocks/companyProfile.mock";
import { CompanyNameAndNumber } from "../../../../../src/types/utilTypes";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmCorrectCompanyHandler", () => {
    return {
        ConfirmCorrectCompanyHandler: jest.fn().mockImplementation(() => {
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
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const getCompanyAddedSuccessFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getCompanyAddedSuccessFullUrl");

describe("confirmCompanyControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render confirm company page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        getExtraDataSpy.mockReturnValue(validActiveCompanyProfile);
        // When
        await confirmCompanyControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmCorrectCompanyHandler).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.COMPANY_PROFILE);
        expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.CONFIRM_COMPANY_DETAILS_INDICATOR, true);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRM_COMPANY_PAGE, expectedViewData);
    });

    it("should throw an error if a profile is not found in session", async () => {

        getExtraDataSpy.mockReturnValue(undefined);

        await expect(confirmCompanyControllerGet(req as Request, res as Response))
            .rejects.toThrow("company profile not found in session");
    });

});

describe("confirmCompanyControllerPost", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should redirect to create company association page",
        async () => {
            // Given
            const expectedViewData = {
                backLinkHref: "/test"
            };
            mockExecute.mockReturnValue(expectedViewData);
            getExtraDataSpy.mockReturnValue(validActiveCompanyProfile);
            const confirmedCompanyForAssociation: CompanyNameAndNumber = {
                companyNumber: validActiveCompanyProfile.companyNumber,
                companyName: validActiveCompanyProfile.companyName
            };
            const expectedUrl = "/test/test-url";
            getCompanyAddedSuccessFullUrlSpy.mockReturnValue(expectedUrl);
            // When
            await confirmCompanyControllerPost(req as Request, res as Response);
            // Then
            expect(setExtraDataSpy).toHaveBeenCalledTimes(2);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssociation);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS, true);
            expect(getCompanyAddedSuccessFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getCompanyAddedSuccessFullUrlSpy).toHaveBeenCalledWith(validActiveCompanyProfile.companyNumber);
            expect(redirectMock).toHaveBeenCalledTimes(1);
            expect(redirectMock).toHaveBeenCalledWith(expectedUrl);
        });

    it("should throw an error if a profile is not found in session", async () => {

        getExtraDataSpy.mockReturnValue(undefined);

        await expect(confirmCompanyControllerGet(req as Request, res as Response))
            .rejects.toThrow("company profile not found in session");
    });
});
