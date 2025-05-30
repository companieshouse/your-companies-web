import { Request, Response } from "express";
import { CompanyInvitationsDeclineHandler } from "../../../../../src/routers/handlers/yourCompanies/companyInvitationsDeclineHandler";
import { companyInvitationsDeclineControllerGet } from "../../../../../src/routers/controllers/companyInvitationsDeclineController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/companyInvitationsDeclineHandler", () => {
    return {
        CompanyInvitationsDeclineHandler: jest.fn().mockImplementation(() => {
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
const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");

describe("companyInvitationsDeclineControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render company invitations decline page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await companyInvitationsDeclineControllerGet(req as Request, res as Response);
        // Then
        expect(CompanyInvitationsDeclineHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.COMPANY_INVITATIONS_DECLINE_PAGE, expectedViewData);
    });

    it("should redirect to company invitations page if association state changed", async () => {
        // Given
        const expectedViewData = {
            associationStateChanged: "associationStateChanged value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        const expectedUrl = "test/test-url";
        getFullUrlSpy.mockReturnValue(expectedUrl);
        // When
        await companyInvitationsDeclineControllerGet(req as Request, res as Response);
        // Then
        expect(CompanyInvitationsDeclineHandler).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), expectedViewData.associationStateChanged);
        expect(getFullUrlSpy).toHaveBeenCalledTimes(1);
        expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_INVITATIONS_URL);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith(expectedUrl);
    });
});
