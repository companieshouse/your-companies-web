
import { isComingFromCheckEmailPage } from "../../../src/middleware/navigation.middleware";
import { mockRequest } from "../../mocks/request.mock";
import { mockResponse } from "../../mocks/response.mock";

describe("isComingFromCheckEmailPage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should redirect if no referer", () => {
        const next = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        isComingFromCheckEmailPage(request, response, next);
        expect(next).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalled();
    });
    it("should allow request from the check email page", () => {
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const url = `/your-companies/company/1/add-presenter-check-details`;
        request.headers.referer = url;
        isComingFromCheckEmailPage(request, response, mockedNext);
        expect(mockedNext).toHaveBeenCalled();
    });
    it("should allow requests from the authorised email added success page", () => {
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const url = "/your-companies/manage-authorised-people/1/confirmation-person-added";
        request.headers.referer = url;
        isComingFromCheckEmailPage(request, response, mockedNext);
        expect(mockedNext).toHaveBeenCalled();
    });
    it("should return an error page if there is an unrecognised referer", () => {
        const mockedNext = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const url = "/unknown/url/path";
        request.headers.referer = url;
        isComingFromCheckEmailPage(request, response, mockedNext);
        expect(response.status).toHaveBeenCalled();
        expect(mockedNext).not.toHaveBeenCalled();
    });
});
