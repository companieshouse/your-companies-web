import mocks from "../../../../mocks/all.middleware.mock";
import { companyAssociationsPage2, companyAssociationsPage1, companyAssociations } from "../../../../mocks/associations.mock";
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

const deleteSearchStringEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteSearchStringEmail");

jest.mock("../../../../../src/lib/Logger");
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
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");

describe("GET /your-companies/manage-authorised-people/:companyNumber", () => {
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
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect to the landing page /your-companies if user not authorised to see the page", async () => {
        // Given
        const notAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER, associationId: "" };
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(notAssociated);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(constants.LANDING_URL);
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and expected $langInfo content if language version set to '$langVersion'",
        async ({ langVersion, lang, langCommon }) => {
            // Given
            getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociations));
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(`${companyAssociations.items[0].companyName} (${companyAssociations.items[0].companyNumber})`);
            expect(response.text).toContain(lang.people_digitally_authorised_to_file_online);
            expect(response.text).toContain(lang.anyone_with_access_to_the_current_authentication);
            expect(response.text).toContain(lang.add_new_authorised_person);
            expect(response.text).toContain(lang.details_of_authorised_people);
            expect(response.text).toContain(lang.name);
            expect(response.text).toContain(lang.digital_authorisation_status);
            expect(response.text).toContain(lang.remove);
            expect(response.text).toContain(langCommon.back_to_your_companies);
            expect(response.text).not.toContain(langCommon.success);
            expect(response.text).not.toContain(lang.digital_authorisation_cancelled);
            expect(response.text).toContain(companyAssociations.items[0].userEmail);
            expect(response.text).toContain(companyAssociations.items[1].userEmail);
            expect(response.text).toContain(companyAssociations.items[2].userEmail);
            expect(response.text).toContain(companyAssociations.items[3].userEmail);
        });

    it("should display all 15 associations for page 1 with a next button", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage1));
        // When
        const response = await router.get(`${url}`);
        // Then
        companyAssociationsPage1.items.forEach((association) => {
            expect(response.text).toContain(association.userEmail);
        });
        expect(response.text).toContain(enCommon.next);
        expect(response.text).not.toContain(enCommon.previous);
    });

    it("should display the assocations for the last paginated page", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage2));
        // When
        const response = await router.get(`${url}?page=2`);
        // Then
        companyAssociationsPage2.items.forEach((association) => {
            expect(response.text).toContain(association.userEmail + ` (${association.userEmail})`);
        });
        expect(response.text).not.toContain(enCommon.next);
        expect(response.text).toContain(enCommon.previous);
    });

    it("should not display pagination when there is one page of associations", async () => {
        // Given
        const mockCompanyAssociations = { ...companyAssociationsPage1 };
        mockCompanyAssociations.totalPages = 1;
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(mockCompanyAssociations));
        // When
        const response = await router.get(`${url}?page=2`);
        // Then
        expect(response.text).not.toContain(enCommon.next);
        expect(response.text).not.toContain(enCommon.previous);
    });

    it("should display the pagination links in welsh", async () => {
        // Given
        const mockCompanyAssociations = { ...companyAssociationsPage1 };
        mockCompanyAssociations.totalPages = 10;
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(mockCompanyAssociations));
        // When
        const response = await router.get(`${url}?page=4&lang=cy`);
        // Then
        expect(response.text).toContain(cyCommon.next);
        expect(response.text).toContain(cyCommon.previous);
    });

    it("should call deleteSearchStringEmail function with correct data when url has cancelSearch query param", async () => {
        // When
        await router.get(`${url}?cancelSearch`);
        // Then
        expect(deleteSearchStringEmailSpy).toHaveBeenCalledWith(expect.any(Object), "NI038379");

    });
});
