import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import * as userCompanyAssociationService from "../../../../src/services/userCompanyAssociationService";
import supertest from "supertest";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { Cancellation } from "../../../../src/types/cancellation";
import { USER_REMOVED_FROM_COMPANY_ASSOCIATIONS, YES } from "../../../../src/constants";
import { AuthorisedPerson } from "../../../../src/types/associations";
import * as en from "../../../../src/locales/en/translation/manage-authorised-people.json";
import * as cy from "../../../../src/locales/cy/translation/manage-authorised-people.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as cyCommon from "../../../../src/locales/cy/translation/common.json";
import { Removal } from "../../../../src/types/removal";

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

    it("should return status 200", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(200);
    });

    it("should return expected English content if language version set to English", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
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
        expect(response.text).not.toContain(enCommon.success);
        expect(response.text).not.toContain(en.digital_authorisation_cancelled);
        expect(response.text).toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
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
        expect(response.text).not.toContain(cyCommon.success);
        expect(response.text).not.toContain(cy.digital_authorisation_cancelled);
        expect(response.text).toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });
});

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-cancel-person", () => {
    const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-cancel-person`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "getCompanyAssociations");
    const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "removeUserFromCompanyAssociations");
    const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

    beforeEach(() => {
        jest.clearAllMocks();
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
        expect(response.text).toContain(en.back_to_your_companies);
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
        expect(response.text).toContain(cy.back_to_your_companies);
        expect(response.text).not.toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });
});

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-person-added", () => {
    const companyNumber = "NI038379";
    const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-person-added`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "getCompanyAssociations");
    const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const authorisedPerson: AuthorisedPerson = {
        authorisedPersonEmailAddress: "bob@bob.com",
        authorisedPersonCompanyName: "Acme Ltd"
    };
    getCompanyAssociationsSpy.mockReturnValue(companyAssociations);

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379/confirmation-person-added page", async () => {
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
        sessionUtilsSpy.mockReturnValue(authorisedPerson);

        const response = await router.get(`${url}?lang=en`);
        expect(response.text).toContain(en.authorised_person_success_heading);
        expect(response.text).toContain(en.authorised_person_success_msg1);
        expect(response.text).toContain(en.authorised_person_success_msg2);
        expect(response.text).toContain("Acme Ltd");
        expect(response.text).toContain("bob@bob.com");
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        sessionUtilsSpy.mockReturnValue(authorisedPerson);
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.authorised_person_success_heading);
        expect(response.text).toContain(cy.authorised_person_success_msg1);
        expect(response.text).toContain(cy.authorised_person_success_msg2);
        expect(response.text).toContain("Acme Ltd");
        expect(response.text).toContain("bob@bob.com");
    });
    it("should not display banner if no authorised person details saved in session", async () => {
        sessionUtilsSpy.mockReturnValue(undefined);
        const response = await router.get(`${url}?lang=en`);
        expect(response.text.includes(en.authorised_person_success_heading)).toBe(false);
        expect(response.text.includes("Acme Ltd")).toBe(false);
        expect(response.text.includes("bob@bob.com")).toBe(false);
    });

    describe("GET /your-companies/manage-authorised-people/:companyNumber/authorisation-email-resent", () => {
        const companyNumber = "NI038379";
        const url = `/your-companies/manage-authorised-people/${companyNumber}/authorisation-email-resent`;
        const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "getCompanyAssociations");
        const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

        beforeEach(() => {
            jest.clearAllMocks();
        });

        const resentSuccessEmail = "bob@bob.com";
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);

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
    });
});

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-person-removed", () => {
    const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-person-removed`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "getCompanyAssociations");
    const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(userCompanyAssociationService, "removeUserFromCompanyAssociations");
    const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return expected English content if person removed, their name not provided and language version set to English", async () => {
        // Given
        const removal: Removal = {
            removePerson: YES,
            userEmail: companyAssociations.items[1].userEmail,
            companyNumber: companyAssociations.items[1].companyNumber
        };
        const expectedCompanyAssociations = Object.assign({}, companyAssociations);
        expectedCompanyAssociations.items = companyAssociations.items.filter(item => item.userEmail !== removal.userEmail);
        getCompanyAssociationsSpy.mockReturnValue(expectedCompanyAssociations);
        const expectedBannerHeaderText = companyAssociations.items[1].userEmail + en.is_no_longer_digitally_authorised + companyAssociations.items[1].companyName;
        sessionUtilsSpy.mockReturnValue(removal);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        // When
        const response = await router.get(`${url}?lang=en`);
        // Then
        expect(response.text).toContain(enCommon.success);
        expect(response.text).toContain(expectedBannerHeaderText);
        expect(response.text).toContain(en.weve_sent_an_email_to_the_company);
        expect(response.text).toContain(en.you_may_wish_to);
        expect(response.text).toContain(en.change_the_authentication_code);
        expect(response.text).toContain(en.for_this_company_if + companyAssociations.items[1].userEmail + en.still_has_access_to_it);
        expect(response.text).toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).not.toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });

    it("should return expected Welsh content if person removed, their name not provided and language version set to Welsh", async () => {
        // Given
        const removal: Removal = {
            removePerson: YES,
            userEmail: companyAssociations.items[1].userEmail,
            companyNumber: companyAssociations.items[1].companyNumber
        };
        const expectedCompanyAssociations = Object.assign({}, companyAssociations);
        expectedCompanyAssociations.items = companyAssociations.items.filter(item => item.userEmail !== removal.userEmail);
        getCompanyAssociationsSpy.mockReturnValue(expectedCompanyAssociations);
        const expectedBannerHeaderText = companyAssociations.items[1].userEmail + cy.is_no_longer_digitally_authorised + companyAssociations.items[1].companyName;
        sessionUtilsSpy.mockReturnValue(removal);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        // When
        const response = await router.get(`${url}?lang=cy`);
        // Then
        expect(response.text).toContain(cyCommon.success);
        expect(response.text).toContain(expectedBannerHeaderText);
        expect(response.text).toContain(cy.weve_sent_an_email_to_the_company);
        expect(response.text).toContain(cy.you_may_wish_to);
        expect(response.text).toContain(cy.change_the_authentication_code);
        expect(response.text).toContain(cy.for_this_company_if + companyAssociations.items[1].userEmail + cy.still_has_access_to_it);
        expect(response.text).toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).not.toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
    });

    it("should return expected English content if person removed, their name provided and language version set to English", async () => {
        // Given
        const removal: Removal = {
            removePerson: YES,
            userEmail: companyAssociations.items[3].userEmail,
            userName: companyAssociations.items[3].displayName,
            companyNumber: companyAssociations.items[3].companyNumber
        };
        const expectedCompanyAssociations = Object.assign({}, companyAssociations);
        expectedCompanyAssociations.items = companyAssociations.items.filter(item => item.userEmail !== removal.userEmail);
        getCompanyAssociationsSpy.mockReturnValue(expectedCompanyAssociations);
        const expectedBannerHeaderText = companyAssociations.items[3].displayName + en.is_no_longer_digitally_authorised + companyAssociations.items[3].companyName;
        sessionUtilsSpy.mockReturnValue(removal);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        // When
        const response = await router.get(`${url}?lang=en`);
        // Then
        expect(response.text).toContain(enCommon.success);
        expect(response.text).toContain(expectedBannerHeaderText);
        expect(response.text).toContain(en.weve_sent_an_email_to_the_company);
        expect(response.text).toContain(en.you_may_wish_to);
        expect(response.text).toContain(en.change_the_authentication_code);
        expect(response.text).toContain(en.for_this_company_if + companyAssociations.items[3].displayName + en.still_has_access_to_it);
        expect(response.text).toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).not.toContain(companyAssociations.items[3].userEmail + "</th>");
    });

    it("should return expected Welsh content if person removed, their name provided and language version set to Welsh", async () => {
        // Given
        const removal: Removal = {
            removePerson: YES,
            userEmail: companyAssociations.items[3].userEmail,
            userName: companyAssociations.items[3].displayName,
            companyNumber: companyAssociations.items[3].companyNumber
        };
        const expectedCompanyAssociations = Object.assign({}, companyAssociations);
        expectedCompanyAssociations.items = companyAssociations.items.filter(item => item.userEmail !== removal.userEmail);
        getCompanyAssociationsSpy.mockReturnValue(expectedCompanyAssociations);
        const expectedBannerHeaderText = companyAssociations.items[3].displayName + cy.is_no_longer_digitally_authorised + companyAssociations.items[3].companyName;
        sessionUtilsSpy.mockReturnValue(removal);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        // When
        const response = await router.get(`${url}?lang=cy`);
        // Then
        expect(response.text).toContain(cyCommon.success);
        expect(response.text).toContain(expectedBannerHeaderText);
        expect(response.text).toContain(cy.weve_sent_an_email_to_the_company);
        expect(response.text).toContain(cy.you_may_wish_to);
        expect(response.text).toContain(cy.change_the_authentication_code);
        expect(response.text).toContain(cy.for_this_company_if + companyAssociations.items[3].displayName + cy.still_has_access_to_it);
        expect(response.text).toContain(companyAssociations.items[0].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
        expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
        expect(response.text).not.toContain(companyAssociations.items[3].userEmail + "</th>");
    });
});
