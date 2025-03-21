import { Request, Response } from "express";
import { CompanyInvitationsHandler } from "../../../../../src/routers/handlers/yourCompanies/companyInvitationsHandler";
import { companyInvitationsControllerGet } from "../../../../../src/routers/controllers/companyInvitationsController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/companyInvitationsHandler", () => {
    return {
        CompanyInvitationsHandler: jest.fn().mockImplementation(() => {
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

describe("companyInvitationsControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render company invitations page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await companyInvitationsControllerGet(req as Request, res as Response);
        // Then
        expect(CompanyInvitationsHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.COMPANY_INVITATIONS_PAGE, expectedViewData);
    });
});
