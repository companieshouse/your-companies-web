import { Request, Response } from "express";
import { CheckPresenterHandler } from "../../../../../src/routers/handlers/yourCompanies/checkPresenterHandler";
import { checkPresenterControllerGet, checkPresenterControllerPost } from "../../../../../src/routers/controllers/checkPresenterController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/checkPresenterHandler", () => {
    return {
        CheckPresenterHandler: jest.fn().mockImplementation(() => {
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
const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");

describe("checkPresenterControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render check presenter page", async () => {
        // Given
        const expectedViewData = {
            key: "value"
        };
        mockExecute.mockReturnValue(expectedViewData);
        // When
        await checkPresenterControllerGet(req as Request, res as Response);
        // Then
        expect(CheckPresenterHandler).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.CHECK_PRESENTER_PAGE, expectedViewData);
    });
});

describe("checkPresenterControllerPost", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render check presenter page if an error present in view data",
       async () => {
           // Given
           const expectedViewData = {
               errors: [
                   { key: "value" }
               ]
           };
           mockExecute.mockReturnValue(expectedViewData);
           // When
           await checkPresenterControllerPost(req as Request, res as Response);
           // Then
           expect(CheckPresenterHandler).toHaveBeenCalledTimes(1);
           expect(renderMock).toHaveBeenCalledTimes(1);
           expect(renderMock).toHaveBeenCalledWith(constants.CHECK_PRESENTER_PAGE, expectedViewData);
       });

    test.each([
        {
            where: "authorised person added page",
            condition: "an error does not present in view data",
            urlArg: constants.CONFIRMATION_PERSON_ADDED_URL,
            expectedViewData: {
                companyNumber: "12345",
                associationAlreadyExist: false
            }
        },
        {
            where: "presenter already added page",
            condition: "association already exists",
            urlArg: constants.PRESENTER_ALREADY_ADDED_URL,
            expectedViewData: {
                companyNumber: "12345",
                associationAlreadyExist: true
            }
        }
    ])("should redirect to $where if $condition",
       async ({ urlArg, expectedViewData }) => {
           // Given
           mockExecute.mockReturnValue(expectedViewData);
           getFullUrlSpy.mockReturnValue(urlArg);
           const expectedUrl = urlArg.replace(`:${constants.COMPANY_NUMBER}`, expectedViewData.companyNumber);
           // When
           await checkPresenterControllerPost(req as Request, res as Response);
           // Then
           expect(CheckPresenterHandler).toHaveBeenCalledTimes(1);
           expect(redirectMock).toHaveBeenCalledTimes(1);
           expect(redirectMock).toHaveBeenCalledWith(expectedUrl);
       });
});
