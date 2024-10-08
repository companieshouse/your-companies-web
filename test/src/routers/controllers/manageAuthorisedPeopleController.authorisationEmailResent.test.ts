import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import * as associationsService from "../../../../src/services/associationsService";
import supertest from "supertest";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as en from "../../../../locales/en/manage-authorised-people.json";
import * as cy from "../../../../locales/cy/manage-authorised-people.json";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import * as constants from "../../../../src/constants";
import { AssociationState, AssociationStateResponse } from "../../../../src/types/associations";

const router = supertest(app);

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

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

    beforeEach(() => {
        jest.clearAllMocks();
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
    });

    const resentSuccessEmail = "bob@bob.com";
    getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
    redirectPageSpy.mockReturnValue(false);

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379/authorisation-email-resent page", async () => {
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        const response = await router.get(url);
        expect(response.status).toEqual(200);
    });

    it("should return expected English content if language version set to English", async () => {
        sessionUtilsSpy.mockReturnValue(resentSuccessEmail);

        const response = await router.get(`${url}?lang=en`);
        expect(response.text).toContain(en.authorised_person_success_heading);
        expect(response.text).toContain(en.email_resent_success_success_msg1);
        expect(response.text).toContain(en.email_resent_success_success_msg1);
        expect(response.text).toContain("bob@bob.com");
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        sessionUtilsSpy.mockReturnValue(resentSuccessEmail);
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.authorised_person_success_heading);
        expect(response.text).toContain(cy.email_resent_success_success_msg1);
        expect(response.text).toContain(cy.email_resent_success_success_msg1);
        expect(response.text).toContain("bob@bob.com");
    });
    it("should not display banner if no authorised person details saved in session", async () => {
        sessionUtilsSpy.mockReturnValue(undefined);
        const response = await router.get(`${url}?lang=en`);
        expect(response.text.includes(en.email_resent_success_success_msg1)).toBe(false);
        expect(response.text.includes("bob@bob.com")).toBe(false);
    });

    it("should return status 302 on page redirect", async () => {
        redirectPageSpy.mockReturnValue(true);
        const response = await router.get(url);
        expect(response.status).toEqual(302);
    });

    it("should return correct response message including desired url path", async () => {
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        const response = await router.get(url);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
