import { removeAuthorisedPersonRequestController } from "../../../../../src/routers/controllers/removeAuthorisedPersonRequestController";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as constants from "../../../../../src/constants";
import * as associationsService from "../../../../../src/services/associationsService";
import { companyAssociations } from "../../../../mocks/associations.mock";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";

jest.mock("../../../../../src/lib/Logger");

jest.mock("../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "mark.black@private.com"),
        setExtraData: jest.fn()
    };
});
const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

describe("removeAuthorisedPersonRequestController", () => {
    const session: Session = new Session();
    const request = mockRequest();
    request.session = session;
    const response = mockResponse();

    beforeEach(() => {
        jest.clearAllMocks();
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
    });

    it("should redirect to managed authorised people success page", async () => {
        // Given
        getExtraDataSpy.mockReturnValue({
            removePerson: constants.CONFIRM,
            userEmail: "john.smith@test.com",
            companyNumber: "NI038379"
        });
        request.params.companyNumber = "NI038379";
        // When
        await removeAuthorisedPersonRequestController(request, response);
        // Then
        expect(response.redirect).toHaveBeenCalledWith("/your-companies/manage-authorised-people/NI038379/confirmation-person-removed");
    });

    it("should redirect to removing themselves success page when removing themselves", async () => {
        // Given
        getExtraDataSpy.mockReturnValue({
            removePerson: constants.CONFIRM,
            userEmail: "mark.black@private.com",
            companyNumber: "NI038379"
        });
        const requestWithCompanyParam = request;
        requestWithCompanyParam.params.companyNumber = "NI038379";
        // When
        await removeAuthorisedPersonRequestController(request, response);
        // Then
        expect(response.redirect).toHaveBeenCalledWith("/your-companies/confirmation-person-removed-themselves");
    });

    it("should throw an error when validation fails", async () => {
        // Given
        getExtraDataSpy.mockReturnValue({
            removePerson: constants.CONFIRM,
            userEmail: "bad@email.com",
            companyNumber: "NI038379"
        });
        const requestWithCompanyParam = request;
        requestWithCompanyParam.params.companyNumber = "NI038379";
        // Then
        await expect(removeAuthorisedPersonRequestController(request, response))
            .rejects
            .toThrow("validation for removal of association failed");
    });
});
