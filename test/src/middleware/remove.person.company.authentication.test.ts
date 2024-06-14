import * as sessionUtils from "../../../src/lib/utils/sessionUtils";
import { removeAuthorisedPersonCompanyAuth } from "../../../src/middleware/companyAuthentication/remove.person.company.authentication";
import { mockRequest } from "../../mocks/request.mock";
import { mockResponse } from "../../mocks/response.mock";
import * as constants from "../../../src/constants";

describe("removeAuthorisedPersonCompanyAuth", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    const getLoggedInUserEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");

    it("should redirect to CH company authentication library when removing another user", () => {
        const next = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const companyNumber = "12345678";
        request.params[constants.USER_EMAIL] = "bob@bob.com";
        request.params[constants.COMPANY_NUMBER] = companyNumber;
        getLoggedInUserEmailSpy.mockReturnValue("rob@rob.com");

        removeAuthorisedPersonCompanyAuth(request, response, next);
        expect(next).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalled();
    });
    it("should call next when removing themselves", () => {
        const next = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const companyNumber = "12345678";
        request.params[constants.USER_EMAIL] = "test@test.com";
        request.params[constants.COMPANY_NUMBER] = companyNumber;
        getLoggedInUserEmailSpy.mockReturnValue("test@test.com");
        removeAuthorisedPersonCompanyAuth(request, response, next);
        expect(next).toHaveBeenCalled();
        expect(response.redirect).not.toHaveBeenCalled();
    });
});
