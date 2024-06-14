import { addCompanyJourneyCompanyAuth } from "../../../src/middleware/companyAuthentication/add.company.journey.company.authentication";
import { mockRequest } from "../../mocks/request.mock";
import { mockResponse } from "../../mocks/response.mock";
import * as constants from "../../../src/constants";
import { session } from "../../mocks/session.middleware.mock";
import { AssociationState } from "../../../src/types/associations";
describe("addCompanyJourneyCompanyAuth", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should redirect to CH company authentication library when no association exits", () => {
        const next = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const companyNumber = "12345678";
        request.url = "/anyurl";
        request.session = session;
        request.params[constants.COMPANY_NUMBER] = companyNumber;
        request.session.data.extra_data.confirmedCompanyForAssocation = { companyNumber, companyName: "Test Inc." };
        request.session.data.extra_data.associationStateResponse = { state: AssociationState.COMPNANY_NOT_ASSOCIATED_WITH_USER };

        addCompanyJourneyCompanyAuth(request, response, next);
        expect(next).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalled();
    });
    it("should call next when the user is already has an awaiting invite", () => {
        const next = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const companyNumber = "12345678";
        request.session = session;
        request.params[constants.COMPANY_NUMBER] = companyNumber;
        request.session.data.extra_data.confirmedCompanyForAssocation = { companyNumber, companyName: "Test Inc." };
        request.session.data.extra_data.associationStateResponse = { state: AssociationState.COMPNANY_AWAITING_ASSOCIATION_WITH_USER };

        addCompanyJourneyCompanyAuth(request, response, next);
        expect(next).toHaveBeenCalled();
    });
    it("should throw an error if company number in url does not match the confirmed company in session", () => {
        const next = jest.fn();
        const request = mockRequest();
        const response = mockResponse();
        const companyNumber = "54321";
        request.session = session;
        request.params[constants.COMPANY_NUMBER] = companyNumber;
        request.session.data.extra_data.confirmedCompanyForAssocation = { companyNumber: "1234557", companyName: "Test Inc." };
        request.session.data.extra_data.associationStateResponse = { state: AssociationState.COMPNANY_AWAITING_ASSOCIATION_WITH_USER };
        expect(() => {
            addCompanyJourneyCompanyAuth(request, response, next);
        }).toThrow("addCompanyJourneyCompanyAuth: company number in url did not match company number saved in session");
    });
});
