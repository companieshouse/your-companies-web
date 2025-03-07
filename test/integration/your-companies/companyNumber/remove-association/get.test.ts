import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as associationsService from "../../../../../src/services/associationsService";
import { companyAssociations } from "../../../../mocks/associations.mock";
import * as constants from "../../../../../src/constants";

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(),
        setExtraData: jest.fn()
    };
});

const router = supertest(app);

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
const getLoggedInUserEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");

describe("GET /your-companies/:companyNumber/remove-association", () => {
    const companyNumber = "NI038379";
    const url = `/your-companies/${companyNumber}/remove-association`;
    const loggedUserEmail = "mark.black@private.com";

    beforeEach(() => {
        jest.clearAllMocks();
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        getLoggedInUserEmailSpy.mockReturnValue(loggedUserEmail);
    });

    test.each([
        {
            info: "managed authorised people success page",
            userEmail: "john.smith@test.com",
            redirectUrl: "/your-companies/manage-authorised-people/NI038379/confirmation-person-removed"
        },
        {
            info: "removing themselves success page when removing themselves",
            userEmail: loggedUserEmail,
            redirectUrl: "/your-companies/confirmation-person-removed-themselves"
        }
    ])("should redirect to $info", async ({ userEmail, redirectUrl }) => {
        // Given
        getExtraDataSpy.mockReturnValue({
            removePerson: constants.CONFIRM,
            userEmail,
            companyNumber
        });
        // When
        const response = await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.status).toEqual(302);
        expect(response.header.location).toBe(redirectUrl);
    });
});
