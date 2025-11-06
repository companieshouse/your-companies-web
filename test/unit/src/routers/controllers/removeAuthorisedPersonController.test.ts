import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler } from "../../../../../src/routers/handlers/yourCompanies/removeAuthorisedPersonHandler";
import { removeAuthorisedPersonControllerGet, removeAuthorisedPersonControllerPost } from "../../../../../src/routers/controllers/removeAuthorisedPersonController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";

const mockExecute = jest.fn();
const mockHandlePostRequest = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/removeAuthorisedPersonHandler", () => {
    return {
        RemoveAuthorisedPersonHandler: jest.fn().mockImplementation(() => {
            return {
                execute: mockExecute,
                getTemplateViewName: jest.fn().mockReturnValue("remove-authorised-person"),
                handlePostRequest: mockHandlePostRequest
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

describe("removeAuthorisedPersonControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render remove authorised person page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await removeAuthorisedPersonControllerGet(req as Request, res as Response);
        // Then
        expect(RemoveAuthorisedPersonHandler).toHaveBeenCalledTimes(1);
        expect(deleteExtraDataSpy).toHaveBeenCalledTimes(3);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.USER_EMAILS_ARRAY);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.REMOVE_AUTHORISED_PERSON_PAGE, expectedViewData);
    });
});

describe("removeAuthorisedPersonControllerPost", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create an instance of RemoveAuthorisedPersonHandler and call its handlePostRequest method",
       async () => {
           // Given / When
           await removeAuthorisedPersonControllerPost(req as Request, res as Response);

           // Then
           expect(RemoveAuthorisedPersonHandler).toHaveBeenCalledTimes(1);
           expect(mockHandlePostRequest).toHaveBeenCalledTimes(1);
       });
});
