
// the order of the mock imports matter
import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as associationsService from "../../../../src/services/associationsService";
import { emptyAssociations, userAssociations, userAssociationsWithNumberOfInvitations } from "../../../mocks/associations.mock";
import * as en from "../../../../src/locales/en/translation/your-companies.json";
import * as cy from "../../../../src/locales/cy/translation/your-companies.json";
import * as commonEn from "../../../../src/locales/en/translation/common.json";
import * as commonCy from "../../../../src/locales/cy/translation/common.json";

const router = supertest(app);

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com")
    };
});

describe("GET /your-companies", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the your-companies page", async () => {
        await router.get("/your-companies");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get("/your-companies").expect(200);
    });

    it("should return expected English content if no companies added and language version set to English", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(emptyAssociations);
        // When
        const response = await router.get("/your-companies?lang=en");
        // Then
        expect(response.text).toContain(en.add_a_company);
        expect(response.text).toContain(en.add_a_company_to_your_account);
        expect(response.text).toContain(en.bullet_list[0]);
        expect(response.text).toContain(en.bullet_list[1]);
        expect(response.text).toContain(en.you_have_not_added_any_companies);
        expect(response.text).toContain(en.your_companies);
        expect(response.text).not.toContain(en.company_name);
        expect(response.text).not.toContain(en.company_number);
        expect(response.text).not.toContain(en.people_digitally_authorised_to_file_online);
    });

    it("should return expected Welsh content if no companies added and language version set to Welsh", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(null);
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain(cy.add_a_company);
        expect(response.text).toContain(cy.add_a_company_to_your_account);
        expect(response.text).toContain(cy.bullet_list[0]);
        expect(response.text).toContain(cy.bullet_list[1]);
        expect(response.text).toContain(cy.you_have_not_added_any_companies);
        expect(response.text).toContain(cy.your_companies);
        expect(response.text).not.toContain(cy.company_name);
        expect(response.text).not.toContain(cy.company_number);
        expect(response.text).not.toContain(cy.people_digitally_authorised_to_file_online);
    });

    it("should return expected English content if companies are added and language version set to English", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValueOnce(userAssociations).mockReturnValueOnce(emptyAssociations);
        const expectedTextStart = en.youve_been_invited_to_be_digitally_authorised_start +
            userAssociationsWithNumberOfInvitations.totalResults;
        const expectedTextEnd = en.youve_been_invited_to_be_digitally_authorised_end;
        // When
        const response = await router.get("/your-companies?lang=en");
        // Then
        expect(response.text).toContain(userAssociations.items[0].companyName);
        expect(response.text).toContain(userAssociations.items[0].companyNumber);
        expect(response.text).toContain(en.view_and_manage);
        expect(response.text).toContain(en.your_companies);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.people_digitally_authorised_to_file_online);
        expect(response.text).toContain(en.add_a_company);
        expect(response.text).toContain(en.your_companies);
        expect(response.text).not.toContain(en.add_a_company_to_your_account);
        expect(response.text).not.toContain(en.bullet_list[0]);
        expect(response.text).not.toContain(en.bullet_list[1]);
        expect(response.text).not.toContain(en.you_have_not_added_any_companies);
        expect(response.text).not.toContain(commonEn.important);
        expect(response.text).not.toContain(expectedTextStart);
        expect(response.text).not.toContain(expectedTextEnd);
        expect(response.text).not.toContain(en.view_invitations);
    });

    it("should return expected Welsh content if companies are added and language version set to Welsh", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValueOnce(userAssociations).mockReturnValueOnce(emptyAssociations);
        const expectedTextStart = cy.youve_been_invited_to_be_digitally_authorised_start +
            userAssociationsWithNumberOfInvitations.totalResults;
        const expectedTextEnd = cy.youve_been_invited_to_be_digitally_authorised_end;
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain(userAssociations.items[0].companyName);
        expect(response.text).toContain(userAssociations.items[0].companyNumber);
        expect(response.text).toContain(cy.view_and_manage);
        expect(response.text).toContain(cy.your_companies);
        expect(response.text).toContain(cy.company_name);
        expect(response.text).toContain(cy.company_number);
        expect(response.text).toContain(cy.people_digitally_authorised_to_file_online);
        expect(response.text).toContain(cy.add_a_company);
        expect(response.text).toContain(cy.your_companies);
        expect(response.text).not.toContain(cy.add_a_company_to_your_account);
        expect(response.text).not.toContain(cy.bullet_list[0]);
        expect(response.text).not.toContain(cy.bullet_list[1]);
        expect(response.text).not.toContain(cy.you_have_not_added_any_companies);
        expect(response.text).not.toContain(commonCy.important);
        expect(response.text).not.toContain(expectedTextStart);
        expect(response.text).not.toContain(expectedTextEnd);
        expect(response.text).not.toContain(cy.view_invitations);
    });

    it("should display English version of a banner with information about number of invitations if language version set to English", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(userAssociationsWithNumberOfInvitations);
        const expectedTextStart = en.youve_been_invited_to_be_digitally_authorised_start +
            userAssociationsWithNumberOfInvitations.totalResults;
        const expectedTextEnd = en.youve_been_invited_to_be_digitally_authorised_end;
        // When
        const response = await router.get("/your-companies?lang=en");
        // Then
        expect(response.text).toContain(commonEn.important);
        expect(response.text).toContain(expectedTextStart);
        expect(response.text).toContain(expectedTextEnd);
        expect(response.text).toContain(en.view_invitations);
    });

    it("should display Welsh version of a banner with information about number of invitations if language version set to Welsh", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(userAssociationsWithNumberOfInvitations);
        const expectedTextStart = cy.youve_been_invited_to_be_digitally_authorised_start +
            userAssociationsWithNumberOfInvitations.totalResults;
        const expectedTextEnd = cy.youve_been_invited_to_be_digitally_authorised_end;
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain(commonCy.important);
        expect(response.text).toContain(expectedTextStart);
        expect(response.text).toContain(expectedTextEnd);
        expect(response.text).toContain(cy.view_invitations);
    });
});
