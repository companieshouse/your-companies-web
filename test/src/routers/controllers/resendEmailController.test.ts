import { resendEmailController } from "../../../../src/routers/controllers/resendEmailController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as constants from "../../../../src/constants";
import { isEmailAuthorised } from "../../../../src/services/userCompanyAssociationService";
import { Session } from "@companieshouse/node-session-handler";
jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/services/userCompanyAssociationService");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        setExtraData: jest.fn()
    };
});
const mockIsEmailAuthorised = isEmailAuthorised as jest.Mock;
const session: Session = new Session();

describe("resendEmailController", () => {

    it("should call redirect to resent email success page when email is valid and is associated", async () => {
        jest.clearAllMocks();
        mockIsEmailAuthorised.mockResolvedValueOnce(true);
        const request = mockRequest();
        const response = mockResponse();
        request.params[constants.USER_EMAIL] = "bob1@bob.com";
        request.session = session;
        request.session.setExtraData("companyNumber", "1234567");
        await resendEmailController(request, response);
        expect(response.redirect).toHaveBeenCalledWith("/your-companies/manage-authorised-people/1234567/authorisation-email-resent");
    });
    it("should reject invalid emails", async () => {
        jest.clearAllMocks();
        const request = mockRequest();
        const response = mockResponse();
        request.params[constants.USER_EMAIL] = "bob2";
        request.session = session;
        request.session.setExtraData("companyNumber", "1234567");
        await resendEmailController(request, response);
        expect(response.status).toHaveBeenCalledWith(404);
    });
    it("should reject emails not already in association list", async () => {
        jest.clearAllMocks();
        const request = mockRequest();
        const response = mockResponse();
        request.params[constants.USER_EMAIL] = "bob@bob3.com";
        request.session = session;
        request.session.setExtraData("companyNumber", "1234567");
        mockIsEmailAuthorised.mockResolvedValueOnce(false);
        await resendEmailController(request, response);
        expect(response.status).toHaveBeenCalledWith(404);
    });
});
