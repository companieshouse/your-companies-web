
// the order of the mock imports matter
import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as associationsService from "../../../../src/services/associationsService";
import { emptyAssociations, userAssociations, userAssociationsWithNumberOfInvitations } from "../../../mocks/associations.mock";
import * as en from "../../../../locales/en/your-companies.json";
import * as cy from "../../../../locales/cy/your-companies.json";
import { getExtraData, setExtraData } from "../../../../src/lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";

const router = supertest(app);

const session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
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
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(emptyAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
        getInvitationsSpy.mockReturnValue(emptyAssociations);
        await router.get("/your-companies").expect(200);
    });

    it("should return expected English content if no companies added and language version set to English", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(emptyAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
        getInvitationsSpy.mockReturnValue(emptyAssociations);
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
        userAssociationsSpy.mockReturnValue(emptyAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
        getInvitationsSpy.mockReturnValue(emptyAssociations);
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
        userAssociationsSpy.mockReturnValueOnce(userAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
        getInvitationsSpy.mockReturnValueOnce(emptyAssociations);
        const expectedText = cy.view_invitations + " " + "&#40;" +
            userAssociationsWithNumberOfInvitations.totalResults + "&#41;";
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
        expect(response.text).not.toContain(expectedText);
    });

    it("should return expected Welsh content if companies are added and language version set to Welsh", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValueOnce(userAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
        getInvitationsSpy.mockReturnValueOnce(emptyAssociations);
        const expectedText = cy.view_invitations + " " + "&#40;" +
            userAssociationsWithNumberOfInvitations.totalResults + "&#41;";
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
        expect(response.text).not.toContain(expectedText);
    });

    it("should display English version of a banner with information about number of invitations if language version set to English", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(userAssociationsWithNumberOfInvitations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
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
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValueOnce(userAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
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
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValueOnce(userAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
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
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockReturnValueOnce(userAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
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
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockResolvedValue(userAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
        getInvitationsSpy.mockResolvedValue({ items: [] });

        // When
        const response = await router.get("/your-companies?lang=en");

        // Then
        userAssociations.items.forEach(company => {
            expect(response.text).toContain("Active"); // Check for "Active" instead of AssociationStatus.CONFIRMED
        });
    });

    it("should include a remove company link for each company", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockResolvedValue(userAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
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
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
        userAssociationsSpy.mockResolvedValue(userAssociations);
        const getInvitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");
        getInvitationsSpy.mockResolvedValue({ items: [] });

        // When
        const response = await router.get("/your-companies?lang=cy");

        // Then
        userAssociations.items.forEach(company => {
            expect(response.text).toContain("Active")
            const expectedLink = `/your-companies/remove-company/${company.companyNumber}`;
            expect(response.text).toContain(expectedLink);
            expect(response.text).toContain(cy.remove_company);
        });
    });
});
