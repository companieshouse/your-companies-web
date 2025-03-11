import mocks from "../../../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../../../mocks/associations.mock";
import app from "../../../../../../src/app";
import * as associationsService from "../../../../../../src/services/associationsService";
import supertest from "supertest";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import en from "../../../../../../locales/en/manage-authorised-people.json";
import cy from "../../../../../../locales/cy/manage-authorised-people.json";
import * as referrerUtils from "../../../../../../src/lib/utils/referrerUtils";
import * as constants from "../../../../../../src/constants";
import { AssociationState, AssociationStateResponse } from "../../../../../../src/types/associations";

const router = supertest(app);

jest.mock("../../../../../../src/lib/Logger");
jest.mock("../../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn(),
        deleteExtraData: jest.fn()
    };
});

describe("GET /your-companies/manage-authorised-people/:companyNumber/authorisation-email-resent", () => {
    const companyNumber = "NI038379";
    const url = `/your-companies/manage-authorised-people/${companyNumber}/authorisation-email-resent`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
    const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
    const isAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "" };
    const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
    const resentSuccessEmail = "bob@bob.com";

    beforeEach(() => {
        jest.clearAllMocks();
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        redirectPageSpy.mockReturnValue(false);
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379/authorisation-email-resent page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        const response = await router.get(url);
        expect(response.status).toEqual(200);
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "English", langVersion: undefined, lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return status 200 and expected $langInfo content if language version set to $langVersion",
        async ({ langVersion, lang }) => {
            // Given
            sessionUtilsSpy.mockReturnValue(resentSuccessEmail);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.authorised_person_success_heading);
            expect(response.text).toContain(lang.email_resent_success_success_msg1);
            expect(response.text).toContain(lang.email_resent_success_success_msg1);
            expect(response.text).toContain("bob@bob.com");
        });

    it("should not display banner if no authorised person details saved in session", async () => {
        // Given
        sessionUtilsSpy.mockReturnValue(undefined);
        // When
        const response = await router.get(`${url}?lang=en`);
        // Then
        expect(response.text.includes(en.email_resent_success_success_msg1)).toBe(false);
        expect(response.text.includes("bob@bob.com")).toBe(false);
    });

    it("should return status 302 on page redirect", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
    });

    it("should return correct response message including desired url path", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
