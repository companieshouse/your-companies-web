import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import * as associationsService from "../../../../src/services/associationsService";
import supertest from "supertest";
import * as en from "../../../../locales/en/manage-authorised-people.json";
import * as cy from "../../../../locales/cy/manage-authorised-people.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";
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

const companyNumber = "NI038379";

describe("GET /your-companies/manage-authorised-people/:companyNumber", () => {
    const url = `/your-companies/manage-authorised-people/${companyNumber}`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
    const isAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "" };
    const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");

    beforeEach(() => {
        jest.clearAllMocks();
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379 page", async () => {
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociations));
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociations));
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(200);
    });

    it("should redirect to the langing page if user not authorised to see the page", async () => {
        // Given
        const isAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER, associationId: "" };
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(constants.LANDING_URL);
    });

    it("should return expected English content if language version set to English", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociations));
        // When
        const response = await router.get(`${url}`);
        // Then
        expect(response.text).toContain(`${companyAssociations.items[0].companyName} (${companyAssociations.items[0].companyNumber})`);
        expect(response.text).toContain(en.people_digitally_authorised_to_file_online);
        expect(response.text).toContain(en.anyone_with_access_to_the_current_authentication);
        expect(response.text).toContain(en.add_new_authorised_person);
        expect(response.text).toContain(en.details_of_authorised_people);
        expect(response.text).toContain(en.email_address);
        expect(response.text).toContain(en.name);
        expect(response.text).toContain(en.status);
        expect(response.text).toContain(en.remove);
        expect(response.text).toContain(enCommon.back_to_your_companies);
        expect(response.text).not.toContain(enCommon.success);
        expect(response.text).not.toContain(en.digital_authorisation_cancelled);
        expect(response.text).toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociations));
        // When
        const response = await router.get(`${url}?lang=cy`);
        // Then
        expect(response.text).toContain(`${companyAssociations.items[0].companyName} (${companyAssociations.items[0].companyNumber})`);
        expect(response.text).toContain(cy.people_digitally_authorised_to_file_online);
        expect(response.text).toContain(cy.anyone_with_access_to_the_current_authentication);
        expect(response.text).toContain(cy.add_new_authorised_person);
        expect(response.text).toContain(cy.details_of_authorised_people);
        expect(response.text).toContain(cy.email_address);
        expect(response.text).toContain(cy.name);
        expect(response.text).toContain(cy.status);
        expect(response.text).toContain(cy.remove);
        expect(response.text).toContain(cyCommon.back_to_your_companies);
        expect(response.text).not.toContain(cyCommon.success);
        expect(response.text).not.toContain(cy.digital_authorisation_cancelled);
        expect(response.text).toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });
});
