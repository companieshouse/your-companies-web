import { Request, Response } from "express";
import {
    ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler
} from "../../../../../src/routers/handlers/yourCompanies/confirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler";
import {
    confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet,
    confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost
} from "../../../../../src/routers/controllers/confirmCompanyDetailsForRestoringYourDigitalAuthorisationController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";
import { Session } from "@companieshouse/node-session-handler";
import { validActiveCompanyProfile } from "../../../../mocks/companyProfile.mock";
import { CompanyNameAndNumber } from "../../../../../src/types/utilTypes";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/confirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler", () => {
    return {
        ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler: jest.fn().mockImplementation(() => {
            return {
                execute: mockExecute
            };
        })
    };
});

const companyNumber = "12345678";
const req: Request = mockRequest();
req.session = new Session();
req.params = { [constants.COMPANY_NUMBER]: companyNumber };
const res: Response = mockResponse();
const renderMock = jest.fn();
res.render = renderMock;
const redirectMock = jest.fn();
res.redirect = redirectMock;
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const tryRestoringYourDigitalAuthorisationFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "tryRestoringYourDigitalAuthorisationFullUrl");

describe("confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render confirm company page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet(req as Request, res as Response);
        // Then
        expect(ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler).toHaveBeenCalledTimes(1);
        expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CONFIRM_COMPANY_DETAILS_INDICATOR, true);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CONFIRM_COMPANY_PAGE, expectedViewData);
    });
});

describe("confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost", () => {

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
            const confirmedCompanyForAssocation: CompanyNameAndNumber = {
                companyNumber: validActiveCompanyProfile.companyNumber,
                companyName: validActiveCompanyProfile.companyName
            };
            const expectedUrl = "/test/test-url";
            tryRestoringYourDigitalAuthorisationFullUrlSpy.mockReturnValue(expectedUrl);
            // When
            await confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost(req as Request, res as Response);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), `${constants.COMPANY_PROFILE}_${companyNumber}`);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
            expect(tryRestoringYourDigitalAuthorisationFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(tryRestoringYourDigitalAuthorisationFullUrlSpy).toHaveBeenCalledWith(validActiveCompanyProfile.companyNumber);
            expect(redirectMock).toHaveBeenCalledTimes(1);
            expect(redirectMock).toHaveBeenCalledWith(expectedUrl);
        });
});
