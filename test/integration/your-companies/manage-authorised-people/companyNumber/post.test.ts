import mocks from "../../../../mocks/all.middleware.mock";
import { companyAssociationsPage1, companyAssociations } from "../../../../mocks/associations.mock";
import app from "../../../../../src/app";
import * as associationsService from "../../../../../src/services/associationsService";
import supertest from "supertest";
import en from "../../../../../locales/en/manage-authorised-people.json";
import cy from "../../../../../locales/cy/manage-authorised-people.json";
import enCommon from "../../../../../locales/en/common.json";
import cyCommon from "../../../../../locales/cy/common.json";
import { AssociationState, AssociationStateResponse } from "../../../../../src/types/associations";
import * as constants from "../../../../../src/constants";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";

const router = supertest(app);

jest.mock("../../../../../src/lib/Logger");
const getSearchStringEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getSearchStringEmail");
const setSearchStringEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setSearchStringEmail");

jest.mock("../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn(),
        deleteExtraData: jest.fn()
    };
});

const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
const searchForCompanyAssociationByEmailSpy: jest.SpyInstance = jest.spyOn(associationsService, "searchForCompanyAssociationByEmail");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");

describe("POST /your-companies/manage-authorised-people/:companyNumber", () => {
    const companyNumber = "NI038379";
    const url = `/your-companies/manage-authorised-people/${companyNumber}`;
    const isAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "" };

    beforeEach(() => {
        jest.clearAllMocks();
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379 page", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage1));
        // When
        await router.post(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect to the landing page /your-companies if user not authorised to see the page", async () => {
        // Given
        const notAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER, associationId: "" };
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(notAssociated);
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(constants.LANDING_URL);
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and expected $langInfo match found content if language version set to '$langVersion'",
        async ({ langVersion, lang, langCommon }) => {
            // Given
            searchForCompanyAssociationByEmailSpy.mockReturnValue(Promise.resolve(companyAssociations.items[0]));
            getSearchStringEmailSpy.mockReturnValue("bob@bob.com");
            // When
            const response = await router.post(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(`${companyAssociations.items[0].companyName} (${companyAssociations.items[0].companyNumber})`);
            expect(response.text).toContain(lang.people_digitally_authorised_to_file_online);
            expect(response.text).toContain(lang.anyone_with_access_to_the_current_authentication);
            expect(response.text).toContain(lang.add_new_authorised_person);
            expect(response.text).toContain(lang.details_of_authorised_people);
            expect(response.text).toContain(lang.email_address);
            expect(response.text).toContain(lang.name);
            expect(response.text).toContain(lang.authorisation_status);
            expect(response.text).toContain(langCommon.back_to_your_companies);
            expect(response.text).toContain(lang.match_found_for + " 'bob@bob.com'");
            expect(response.text).not.toContain(langCommon.success);
            expect(response.text).not.toContain(lang.digital_authorisation_cancelled);
            expect(response.text).toContain(companyAssociations.items[0].userEmail);

        });

    it("should display no results found when email search is not found by api service", async () => {
        // Given
        getSearchStringEmailSpy.mockReturnValue("rob@rob.com");
        searchForCompanyAssociationByEmailSpy.mockReturnValue(Promise.resolve(null));

        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage1));
        // When
        const response = await router.post(`${url}`);
        // Then
        expect(response.text).toContain(en.no_results_found);

    });

    it("should call setSearchStringEmail to save the form input to session when values are present in the post request", async () => {
        // Given
        getSearchStringEmailSpy.mockReturnValue("bob@example.com");
        searchForCompanyAssociationByEmailSpy.mockReturnValue(Promise.resolve(null));

        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage1));
        // When
        await router.post(`${url}`).send({ searchEmail: "bob@example.com", action: "trySearch" });
        // Then
        expect(setSearchStringEmailSpy).toHaveBeenCalledWith(expect.any(Object), "bob@example.com", "NI038379");

    });

    it("should display an error on the page when a invlid email is entered", async () => {
        // Given
        getSearchStringEmailSpy.mockReturnValue("invalid-email");
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage1));

        // When
        const response = await router.post(`${url}`).send({ searchEmail: "invalid-email", action: "trySearch" });
        // Then
        expect(response.text).toContain(en.errors_email_invalid);

    });

});
