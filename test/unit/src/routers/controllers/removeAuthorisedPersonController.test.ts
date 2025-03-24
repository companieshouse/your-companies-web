import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler } from "../../../../../src/routers/handlers/yourCompanies/removeAuthorisedPersonHandler";
import { removeAuthorisedPersonControllerGet, removeAuthorisedPersonControllerPost } from "../../../../../src/routers/controllers/removeAuthorisedPersonController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";

const mockExecute = jest.fn();
jest.mock("../../../../../src/routers/handlers/yourCompanies/removeAuthorisedPersonHandler", () => {
    return {
        RemoveAuthorisedPersonHandler: jest.fn().mockImplementation(() => {
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
        expect(deleteExtraDataSpy).toHaveBeenCalledTimes(2);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        expect(deleteExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.USER_EMAILS_ARRAY);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(constants.REMOVE_AUTHORISED_PERSON_PAGE, expectedViewData);
    });
});

describe("removeAuthorisedPersonControllerPost", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render remove authorised person page if an error present in view data",
        async () => {
            // Given
            const expectedViewData = {
                errors: [
                    { key: "value" }
                ]
            };
            mockExecute.mockReturnValue(expectedViewData);
            // When
            await removeAuthorisedPersonControllerPost(req as Request, res as Response);
            // Then
            expect(RemoveAuthorisedPersonHandler).toHaveBeenCalledTimes(1);
            expect(renderMock).toHaveBeenCalledTimes(1);
            expect(renderMock).toHaveBeenCalledWith(constants.REMOVE_AUTHORISED_PERSON_PAGE, expectedViewData);
        });

    it("should redirect to remove association page if an error does not present in view data",
        async () => {
            // Given
            const expectedViewData = {
                companyNumber: "12345"
            };
            mockExecute.mockReturnValue(expectedViewData);
            const url = "/your-companies/12345/remove-association";
            getFullUrlSpy.mockReturnValue(`${constants.LANDING_URL}${constants.REMOVE_ASSOCIATION_URL}`);
            // When
            await removeAuthorisedPersonControllerPost(req as Request, res as Response);
            // Then
            expect(RemoveAuthorisedPersonHandler).toHaveBeenCalledTimes(1);
            expect(getFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.REMOVE_ASSOCIATION_URL);
            expect(redirectMock).toHaveBeenCalledTimes(1);
            expect(redirectMock).toHaveBeenCalledWith(url);
        });
});
