import { Request, Response } from "express";
import { resendEmailController } from "../../../../../src/routers/controllers/resendEmailController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as validator from "../../../../../src/lib/validation/generic";
import logger from "../../../../../src/lib/Logger";
import * as associationService from "../../../../../src/services/associationsService";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";

jest.mock("../../../../../src/lib/Logger");
const req: Request = mockRequest();
req.session = new Session();
const res: Response = mockResponse();
const renderMock = jest.fn();
res.render = renderMock;
const redirectMock = jest.fn();
res.redirect = redirectMock;
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const validateEmailStringSpy: jest.SpyInstance = jest.spyOn(validator, "validateEmailString");
const createAssociationSpy: jest.SpyInstance = jest.spyOn(associationService, "createAssociation");
const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");
logger.info = jest.fn();

describe("resendEmailController", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should redirect to something went wrong page if provided email is invalid",
        async () => {
            // Given
            const companyNumber = "12345";
            const email = "test@test@com";
            getExtraDataSpy.mockReturnValue(companyNumber);
            req.params = { [constants.USER_EMAIL]: email };
            const expectedMessage = `Email ${email} invalid or not on the authorisation list for company ${companyNumber}`;
            validateEmailStringSpy.mockReturnValue(false);
            const expectedUrl = "your-companies/something-went-wrong";
            getFullUrlSpy.mockReturnValue(expectedUrl);
            // When
            await resendEmailController(req as Request, res as Response);
            // Then
            expect(validateEmailStringSpy).toHaveBeenCalledWith(email);
            expect(logger.info).toHaveBeenCalledWith(expectedMessage);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
        });

    it("should redirect to manage authorised people confirmation email resent page",
        async () => {
            // Given
            const companyNumber = "12345";
            const email = "test@test.com";
            getExtraDataSpy.mockReturnValue(companyNumber);
            req.params = { [constants.USER_EMAIL]: email };
            validateEmailStringSpy.mockReturnValue(true);
            const response = "54321";
            createAssociationSpy.mockReturnValue(response);
            const expectedUrl = `${constants.LANDING_URL}/manage-authorised-people/12345/authorisation-email-resent`;
            getFullUrlSpy.mockReturnValue(`${constants.LANDING_URL}${constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL}`);
            // When
            await resendEmailController(req as Request, res as Response);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.COMPANY_NUMBER);
            expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.RESENT_SUCCESS_EMAIL, email);
            expect(createAssociationSpy).toHaveBeenCalledTimes(1);
            expect(createAssociationSpy).toHaveBeenCalledWith(req, companyNumber, email);
            expect(getFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getFullUrlSpy).toHaveBeenCalledWith(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL);
            expect(redirectMock).toHaveBeenCalledTimes(1);
            expect(redirectMock).toHaveBeenCalledWith(expectedUrl);
        });
});
