import { Request, Response } from "express";
import { CancelPersonHandler } from "../../../../../src/routers/handlers/yourCompanies/cancelPersonHandler";
import { cancelPersonControllerGet, cancelPersonControllerPost } from "../../../../../src/routers/controllers/cancelPersonController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/cancelPersonHandler", () => {
    return {
        CancelPersonHandler: jest.fn().mockImplementation(() => {
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

describe("cancelPersonControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render cancel person page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await cancelPersonControllerGet(req as Request, res as Response);
        // Then
        expect(CancelPersonHandler).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledTimes(2);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.USER_EMAILS_ARRAY);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CANCEL_PERSON_PAGE, expectedViewData);
    });
});

describe("cancelPersonControllerPost", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render cancel person page if an error present in view data",
        async () => {
            // Given
            const expectedViewData = {
                errors: [
                    { key: "value" }
                ]
            };
            mockExecute.mockReturnValue(expectedViewData);
            // When
            await cancelPersonControllerPost(req as Request, res as Response);
            // Then
            expect(CancelPersonHandler).toHaveBeenCalledTimes(1);
            expect(renderMock).toHaveBeenCalledTimes(1);
            expect(renderMock).toHaveBeenCalledWith(constants.CANCEL_PERSON_PAGE, expectedViewData);
        });

    it("should redirect to confirm company details page if an error does not present in view data",
        async () => {
            // Given
            const expectedViewData = {
                backLinkHref: "/test"
            };
            mockExecute.mockReturnValue(expectedViewData);
            // When
            await cancelPersonControllerPost(req as Request, res as Response);
            // Then
            expect(CancelPersonHandler).toHaveBeenCalledTimes(1);
            expect(redirectMock).toHaveBeenCalledTimes(1);
            expect(redirectMock).toHaveBeenCalledWith(`${expectedViewData.backLinkHref}${constants.CONFIRMATION_CANCEL_PERSON_URL}`);
        });
});
