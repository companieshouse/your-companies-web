import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { removeAuthorisedPersonCompanyAuth } from "../../../../src/middleware/companyAuthentication/remove.person.company.authentication";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as constants from "../../../../src/constants";

describe("removeAuthorisedPersonCompanyAuth", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    const getLoggedInUserIdSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserId");

    it("should redirect to CH company authentication library when removing another user", () => {
        const next = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const companyNumber = "12345678";
        request.params[constants.ASSOCIATIONS_ID] = "12345";
        request.params[constants.COMPANY_NUMBER] = companyNumber;
        getLoggedInUserIdSpy.mockReturnValue("54321");

        removeAuthorisedPersonCompanyAuth(request, response, next);
        expect(next).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalled();
    });

    it("should call next when removing themselves", () => {
        const next = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const companyNumber = "12345678";
        getLoggedInUserIdSpy.mockReturnValue("12345");
        request.params[constants.COMPANY_NUMBER] = companyNumber;
        request.params[constants.ASSOCIATIONS_ID] = "12345";
        removeAuthorisedPersonCompanyAuth(request, response, next);
        expect(next).toHaveBeenCalled();
        expect(response.redirect).not.toHaveBeenCalled();
    });
});
