
// the order of the mock imports matter
import mocks from "../../mocks/all.middleware.mock";
import app from "../../../src/app";
import supertest from "supertest";
import * as associationsService from "../../../src/services/associationsService";
import {
    emptyAssociations,
    userAssociations,
    userAssociationsWithNumberOfInvitations,
    userAssociationWithCompanyStatus
} from "../../mocks/associations.mock";
import * as en from "../../../locales/en/your-companies.json";
import * as cy from "../../../locales/cy/your-companies.json";
import { getExtraData, setExtraData } from "../../../src/lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { CompanyStatuses } from "../../../src/types/associations";

const router = supertest(app);

const session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../src/lib/Logger");
jest.mock("../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");

describe("GET /your-companies", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the your-companies page", async () => {
        await router.get("/your-companies");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return status 200 and expected $langInfo content if no companies added and language version set to '$langVersion'",
        async ({ langVersion, lang }) => {
            // Given
            userAssociationsSpy.mockReturnValue(emptyAssociations);
            getInvitationsSpy.mockReturnValue(emptyAssociations);
            // When
            const response = await router.get(`/your-companies?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.add_a_company);
            expect(response.text).toContain(lang.add_a_company_to_your_account);
            expect(response.text).toContain(lang.bullet_list[0]);
            expect(response.text).toContain(lang.bullet_list[1]);
            expect(response.text).toContain(lang.you_have_not_added_any_companies);
            expect(response.text).toContain(lang.your_companies);
            expect(response.text).not.toContain(lang.company_name);
            expect(response.text).not.toContain(lang.company_number);
            expect(response.text).not.toContain(lang.people_digitally_authorised_to_file_online);
        });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return expected $langInfo content if companies are added and language version set to '$langVersion'",
        async ({ langVersion, lang }) => {
            // Given
            userAssociationsSpy.mockReturnValueOnce(userAssociations);
            getInvitationsSpy.mockReturnValueOnce(emptyAssociations);
            const expectedText = lang.view_invitations + " " + "&#40;" +
                userAssociationsWithNumberOfInvitations.totalResults + "&#41;";
            // When
            const response = await router.get(`/your-companies?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(userAssociations.items[0].companyName);
            expect(response.text).toContain(userAssociations.items[0].companyNumber);
            expect(response.text).toContain(lang.view_and_manage);
            expect(response.text).toContain(lang.your_companies);
            expect(response.text).toContain(lang.company_name);
            expect(response.text).toContain(lang.company_number);
            expect(response.text).toContain(lang.people_digitally_authorised_to_file_online);
            expect(response.text).toContain(lang.add_a_company);
            expect(response.text).toContain(lang.your_companies);
            expect(response.text).not.toContain(lang.add_a_company_to_your_account);
            expect(response.text).not.toContain(lang.bullet_list[0]);
            expect(response.text).not.toContain(lang.bullet_list[1]);
            expect(response.text).not.toContain(lang.you_have_not_added_any_companies);
            expect(response.text).not.toContain(expectedText);
        });

    it("should display English version of a banner with information about number of invitations if language version set to English", async () => {
        // Given
        userAssociationsSpy.mockReturnValue(userAssociationsWithNumberOfInvitations);
        getInvitationsSpy.mockReturnValue(userAssociationsWithNumberOfInvitations);
        const expectedText = en.view_invitations + " " + "&#40;" +
            userAssociationsWithNumberOfInvitations.totalResults + "&#41;";
        // When
        const response = await router.get("/your-companies?lang=en");
        // Then
        expect(response.text).toContain(expectedText);
    });

    it("should display Welsh version of a banner with information about number of invitations if language version set to Welsh", async () => {
        // Given
        userAssociationsSpy.mockReturnValueOnce(userAssociations);
        getInvitationsSpy.mockReturnValueOnce(userAssociationsWithNumberOfInvitations);
        const expectedText = cy.view_invitations + " " + "&#40;" +
            userAssociationsWithNumberOfInvitations.totalResults + "&#41;";
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain(expectedText);
    });

    it("should delete the manage authorised people page indicator in extraData on page load", async () => {
        // Given
        userAssociationsSpy.mockReturnValueOnce(userAssociations);
        getInvitationsSpy.mockReturnValueOnce(userAssociationsWithNumberOfInvitations);
        const MANAGE_AUTHORISED_PEOPLE_INDICATOR = "manageAuthorisedPeopleIndicator";
        const value = true;
        setExtraData(session, MANAGE_AUTHORISED_PEOPLE_INDICATOR, value);
        const data = getExtraData(session, MANAGE_AUTHORISED_PEOPLE_INDICATOR);

        // When
        await router.get("/your-companies");
        const resultData = getExtraData(session, MANAGE_AUTHORISED_PEOPLE_INDICATOR);

        // Then
        expect(data).toBeTruthy();
        expect(resultData).toBeUndefined();
    });

    it("should delete the confirm company details page indicator in extraData on page load", async () => {
        // Given
        userAssociationsSpy.mockReturnValueOnce(userAssociations);
        getInvitationsSpy.mockReturnValueOnce(userAssociationsWithNumberOfInvitations);
        const CONFIRM_COMPANY_DETAILS_INDICATOR = "confirmCompanyDetailsIndicator";
        const value = true;
        setExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR, value);
        const data = getExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR);

        // When
        await router.get("/your-companies");
        const resultData = getExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR);

        // Then
        expect(data).toBeTruthy();
        expect(resultData).toBeUndefined();
    });

    it("should display company status for each company", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(userAssociations);
        getInvitationsSpy.mockResolvedValue({ items: [] });

        // When
        const response = await router.get("/your-companies?lang=en");

        // Then
        userAssociations.items.forEach(() => {
            expect(response.text).toContain("Active"); // Check for "Active" instead of AssociationStatus.CONFIRMED
        });
    });

    it("should include a remove company link for each company", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(userAssociations);
        getInvitationsSpy.mockResolvedValue({ items: [] });

        // When
        const response = await router.get("/your-companies?lang=en");

        // Then
        userAssociations.items.forEach(company => {
            const expectedLink = `/your-companies/remove-company/${company.companyNumber}`;
            expect(response.text).toContain(expectedLink);
            expect(response.text).toContain(en.remove_company);

            // Additional checks
            expect(response.text).toContain(company.companyName);
            expect(response.text).toContain(company.companyNumber);
        });
    });

    it("should display company status and remove company link in Welsh", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(userAssociations);
        getInvitationsSpy.mockResolvedValue({ items: [] });

        // When
        const response = await router.get("/your-companies?lang=cy");

        // Then
        userAssociations.items.forEach(company => {
            expect(response.text).toContain("Gweithredol"); // Gweithredol is active in Welsh
            const expectedLink = `/your-companies/remove-company/${company.companyNumber}`;
            expect(response.text).toContain(expectedLink);
            expect(response.text).toContain(cy.remove_company);
        });
    });

    it("should display company status 'active' in Welsh", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(userAssociationWithCompanyStatus);
        getInvitationsSpy.mockResolvedValue({ items: [] });
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain("Gweithredol"); // Gweithredol is active in Welsh
    });

    it("should display company status 'closed' in Welsh", async () => {
        // Given
        const closedCompanyAssociation = {
            ...userAssociationWithCompanyStatus,
            items: [{
                ...userAssociationWithCompanyStatus.items[0],
                companyStatus: CompanyStatuses.CLOSED
            }]
        };
        userAssociationsSpy.mockResolvedValue(closedCompanyAssociation);
        getInvitationsSpy.mockResolvedValue({ items: [] });
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain("Wedi cau");
    });

    it("should display company status 'insolvency-proceedings' in Welsh", async () => {
        // Given
        const insolventCompanyAssociation = {
            ...userAssociationWithCompanyStatus,
            items: [{
                ...userAssociationWithCompanyStatus.items[0],
                companyStatus: CompanyStatuses.INSOLVENCY_PROCEEDINGS
            }]
        };
        userAssociationsSpy.mockResolvedValue(insolventCompanyAssociation);
        getInvitationsSpy.mockResolvedValue({ items: [] });
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain("Trafodion Ansolfedd");
    });

});
