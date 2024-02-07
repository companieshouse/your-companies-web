import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations, emptyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import * as userCompanyAssociationService from "../../../../src/services/userCompanyAssociationService";
import supertest from "supertest";

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

describe("GET /your-companies/manage-authorised-people/:companyNumber", () => {
    const companyNumber = "NI038379";
    const url = `/your-companies/manage-authorised-people/${companyNumber}`;
    const companyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "getCompanyAssociations");
    const en = require("../../../../src/locales/en/translation/manage-authorised-people.json");
    const cy = require("../../../../src/locales/cy/translation/manage-authorised-people.json");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379 page", async () => {
        companyAssociationsSpy.mockReturnValue(emptyAssociations);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        // Given
        companyAssociationsSpy.mockReturnValue(companyAssociations);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(200);
    });

    it("should return expected English content if language version set to English", async () => {
        // Given
        companyAssociationsSpy.mockReturnValue(companyAssociations);
        // When
        const response = await router.get(`${url}?lang=en`);
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
        expect(response.text).toContain(en.back_to_your_companies);
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        // Given
        companyAssociationsSpy.mockReturnValue(companyAssociations);
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
        expect(response.text).toContain(cy.back_to_your_companies);
    });
});
