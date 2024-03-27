import { resendEmailController } from "../../../../src/routers/controllers/resendEmailController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as constants from "../../../../src/constants";
import * as associationsService from "../../../../src/services/associationsService";
import { Session } from "@companieshouse/node-session-handler";
jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        setExtraData: jest.fn()
    };
});
const mockIsEmailAuthorised = jest.spyOn(associationsService, "isEmailAuthorised");
const session: Session = new Session();
const request = mockRequest();
request.session = session;
const response = mockResponse();

describe("resendEmailController", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call redirect to resent email success page when email is valid and is associated", async () => {
        // Given
        mockIsEmailAuthorised.mockResolvedValueOnce(true);
        request.params[constants.USER_EMAIL] = "bob1@bob.com";
        session.setExtraData("companyNumber", "1234567");
        // When
        await resendEmailController(request, response);
        // Then
        expect(response.redirect).toHaveBeenCalledWith("/your-companies/manage-authorised-people/1234567/authorisation-email-resent");
    });

    it("should reject invalid emails", async () => {
        // Given
        request.params[constants.USER_EMAIL] = "bob2";
        session.setExtraData("companyNumber", "1234567");
        // When
        await resendEmailController(request, response);
        // Then
        expect(response.status).toHaveBeenCalledWith(404);
    });

    it("should reject emails not already in association list", async () => {
        // Given
        request.params[constants.USER_EMAIL] = "bob@bob3.com";
        session.setExtraData("companyNumber", "1234567");
        mockIsEmailAuthorised.mockResolvedValueOnce(false);
        // When
        await resendEmailController(request, response);
        // Then
        expect(response.status).toHaveBeenCalledWith(404);
    });
});
