import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import * as userCompanyAssociationService from "../../../../src/services/userCompanyAssociationService";
import supertest from "supertest";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { Cancellation } from "../../../../src/types/cancellation";
import { USER_REMOVED_FROM_COMPANY_ASSOCIATIONS, YES } from "../../../../src/constants";
import * as en from "../../../../src/locales/en/translation/manage-authorised-people.json";
import * as cy from "../../../../src/locales/cy/translation/manage-authorised-people.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as cyCommon from "../../../../src/locales/cy/translation/common.json";

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

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-cancel-person", () => {
    const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-cancel-person`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "getCompanyAssociations");
    const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "removeUserFromCompanyAssociations");
    const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379 page", async () => {
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return expected English content if person cancelled and language version set to English", async () => {
        // Given
        const cancellation: Cancellation = {
            cancelPerson: YES,
            userEmail: companyAssociations.items[0].userEmail,
            companyNumber: companyAssociations.items[0].companyNumber
        };
        const expectedCompanyAssociations = Object.assign({}, companyAssociations);
        expectedCompanyAssociations.items = companyAssociations.items.filter(item => item.userEmail !== cancellation.userEmail);
        getCompanyAssociationsSpy.mockReturnValue(expectedCompanyAssociations);
        sessionUtilsSpy.mockReturnValue(cancellation);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        // When
        const response = await router.get(`${url}?lang=en`);
        // Then
        expect(response.text).toContain(enCommon.success);
        expect(response.text).toContain(en.digital_authorisation_cancelled);
        expect(response.text).toContain(en.you_have_successfully_cancelled_digital_authorisation_start);
        expect(response.text).toContain(en.you_have_successfully_cancelled_digital_authorisation_end);
        expect(response.text).toContain(en.weve_sent_an_email_to_the_company);
        expect(response.text).toContain(`${companyAssociations.items[0].companyName} (${companyAssociations.items[0].companyNumber})`);
        expect(response.text).toContain(en.people_digitally_authorised_to_file_online);
        expect(response.text).toContain(en.anyone_with_access_to_the_current_authentication);
        expect(response.text).toContain(en.add_new_authorised_person);
        expect(response.text).toContain(en.details_of_authorised_people);
        expect(response.text).toContain(en.email_address);
        expect(response.text).toContain(en.name);
        expect(response.text).toContain(en.status);
        expect(response.text).toContain(en.remove);
        expect(response.text).toContain(en.go_back_to_your_companies);
        expect(response.text).not.toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });

    it("should return expected Welsh content if person cancelled and language version set to Welsh", async () => {
        // Given
        const cancellation: Cancellation = {
            cancelPerson: YES,
            userEmail: companyAssociations.items[0].userEmail,
            companyNumber: companyAssociations.items[0].companyNumber
        };
        const expectedCompanyAssociations = Object.assign({}, companyAssociations);
        expectedCompanyAssociations.items = companyAssociations.items.filter(item => item.userEmail !== cancellation.userEmail);
        getCompanyAssociationsSpy.mockReturnValue(expectedCompanyAssociations);
        sessionUtilsSpy.mockReturnValue(cancellation);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        // When
        const response = await router.get(`${url}?lang=cy`);
        // Then
        expect(response.text).toContain(cyCommon.success);
        expect(response.text).toContain(cy.digital_authorisation_cancelled);
        expect(response.text).toContain(cy.you_have_successfully_cancelled_digital_authorisation_start);
        expect(response.text).toContain(cy.you_have_successfully_cancelled_digital_authorisation_end);
        expect(response.text).toContain(cy.weve_sent_an_email_to_the_company);
        expect(response.text).toContain(`${companyAssociations.items[0].companyName} (${companyAssociations.items[0].companyNumber})`);
        expect(response.text).toContain(cy.people_digitally_authorised_to_file_online);
        expect(response.text).toContain(cy.anyone_with_access_to_the_current_authentication);
        expect(response.text).toContain(cy.add_new_authorised_person);
        expect(response.text).toContain(cy.details_of_authorised_people);
        expect(response.text).toContain(cy.email_address);
        expect(response.text).toContain(cy.name);
        expect(response.text).toContain(cy.status);
        expect(response.text).toContain(cy.remove);
        expect(response.text).toContain(cy.go_back_to_your_companies);
        expect(response.text).not.toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });
});
