import mocks from "../../../mocks/all.middleware.mock";
import {
    associationsWithoutInvitations,
    userAssociations,
    userAssociationsWithEmptyInvitations,
    fifteenAssociationsAwaitingApproval
} from "../../../mocks/associations.mock";
import { mockInvitationList, getMockInvitationList, getPaginatedMockInvitationList, fifteenMockInvitations } from "../../../mocks/invitations.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as en from "../../../../src/locales/en/translation/company-invitations.json";
import * as cy from "../../../../src/locales/cy/translation/company-invitations.json";
import * as commonEn from "../../../../src/locales/en/translation/common.json";
import * as commonCy from "../../../../src/locales/cy/translation/common.json";
import * as associationsService from "../../../../src/services/associationsService";
import { AssociationStatus, AssociationList } from "private-api-sdk-node/dist/services/associations/types";

const router = supertest(app);
const url = "/your-companies/company-invitations";
const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
const invitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        userAssociationsSpy.mockReturnValue(associationsWithoutInvitations);
        invitationsSpy.mockReturnValue(mockInvitationList);
    });

    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(url);
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.invited_by);
        expect(response.text).toContain(en.accept);
        expect(response.text).toContain(en.company_number);
    });

    it("should return expected English content if English language selected", async () => {
        const response = await router.get(`${url}?lang=en`);
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.invited_by);
        expect(response.text).toContain(en.accept);
        expect(response.text).toContain(en.company_number);
    });

    it("should return expected Welsh content if Welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.h1);
        expect(response.text).toContain(cy.company_name);
        expect(response.text).toContain(cy.company_number);
        expect(response.text).toContain(cy.invited_by);
        expect(response.text).toContain(cy.accept);
        expect(response.text).toContain(cy.decline);
    });

    it("should return only expected company number, name and email address of a person who sent the invitation", async () => {
        // Given
        const associations = { ...associationsWithoutInvitations };
        associations.items = associationsWithoutInvitations.items.filter(association => association.status === AssociationStatus.AWAITING_APPROVAL);
        userAssociationsSpy.mockReturnValue(associations);
        const expectedEmail = "another.email@acme.com";
        const expectedCompanyNumber = "08449801";
        const expectedCompanyName = "BROWN AND SALTER LIMITED";
        const expectedNotContainEmail = "j.example@gmail.com";
        const expectedNotContainCompanyNumber = "10866549";
        const expectedNotContainCompanyName = "ANDROID TECHNOLOGY LTD";

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(expectedCompanyNumber);
        expect(response.text).toContain(expectedEmail);
        expect(response.text).toContain(expectedCompanyName);
        expect(response.text).not.toContain(expectedNotContainEmail);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber);
        expect(response.text).not.toContain(expectedNotContainCompanyName);
    });

    it("should return an expected text if no invitation awaiting approval exists and language set to English", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(userAssociations);
        invitationsSpy.mockResolvedValue(getMockInvitationList([]));
        const expectedNotContainEmail = "another.email@acme.com";
        const expectedNotContainCompanyNumber1 = "NI038379";
        const expectedNotContainCompanyName1 = "THE POLISH BREWERY";
        const expectedNotContainCompanyNumber2 = "01777777";
        const expectedNotContainCompanyName2 = "BRITISH AIRWAYS PLC";

        // When
        const response = await router.get(url + "?lang=en");

        // Then
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.no_pending_invitations);
        expect(response.text).not.toContain(en.company_name);
        expect(response.text).not.toContain(en.company_number);
        expect(response.text).not.toContain(en.invited_by);
        expect(response.text).not.toContain(expectedNotContainEmail);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber1);
        expect(response.text).not.toContain(expectedNotContainCompanyName1);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber2);
        expect(response.text).not.toContain(expectedNotContainCompanyName2);
    });

    it("should return an expected text if no invitation awaiting approval exists and language set to Welsh", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(userAssociations);
        invitationsSpy.mockResolvedValue(getMockInvitationList([]));
        const expectedNotContainEmail = "another.email@acme.com";
        const expectedNotContainCompanyNumber1 = "NI038379";
        const expectedNotContainCompanyName1 = "THE POLISH BREWERY";
        const expectedNotContainCompanyNumber2 = "01777777";
        const expectedNotContainCompanyName2 = "BRITISH AIRWAYS PLC";

        // When
        const response = await router.get(url + "?lang=cy");

        // Then
        expect(response.text).toContain(cy.h1);
        expect(response.text).toContain(cy.no_pending_invitations);
        expect(response.text).not.toContain(cy.company_name);
        expect(response.text).not.toContain(cy.company_number);
        expect(response.text).not.toContain(cy.invited_by);
        expect(response.text).not.toContain(expectedNotContainEmail);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber1);
        expect(response.text).not.toContain(expectedNotContainCompanyName1);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber2);
        expect(response.text).not.toContain(expectedNotContainCompanyName2);
    });

    it("should return an expected text if no invitation provided", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue({} as AssociationList);
        invitationsSpy.mockResolvedValue(getMockInvitationList([]));
        const expectedNotContainEmail = "another.email@acme.com";
        const expectedNotContainCompanyNumber1 = "NI038379";
        const expectedNotContainCompanyName1 = "THE POLISH BREWERY";
        const expectedNotContainCompanyNumber2 = "01777777";
        const expectedNotContainCompanyName2 = "BRITISH AIRWAYS PLC";

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.no_pending_invitations);
        expect(response.text).not.toContain(en.company_name);
        expect(response.text).not.toContain(en.company_number);
        expect(response.text).not.toContain(en.invited_by);
        expect(response.text).not.toContain(expectedNotContainEmail);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber1);
        expect(response.text).not.toContain(expectedNotContainCompanyName1);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber2);
        expect(response.text).not.toContain(expectedNotContainCompanyName2);
    });

    it("should return an expected text if invitation empty", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(userAssociationsWithEmptyInvitations);
        invitationsSpy.mockResolvedValue(getMockInvitationList([]));
        const expectedNotContainEmail = "another.email@acme.com";
        const expectedNotContainCompanyNumber1 = "NI038379";
        const expectedNotContainCompanyName1 = "THE POLISH BREWERY";
        const expectedNotContainCompanyNumber2 = "01777777";
        const expectedNotContainCompanyName2 = "BRITISH AIRWAYS PLC";

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.no_pending_invitations);
        expect(response.text).not.toContain(en.company_name);
        expect(response.text).not.toContain(en.company_number);
        expect(response.text).not.toContain(en.invited_by);
        expect(response.text).not.toContain(expectedNotContainEmail);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber1);
        expect(response.text).not.toContain(expectedNotContainCompanyName1);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber2);
        expect(response.text).not.toContain(expectedNotContainCompanyName2);
    });

    it("should return invitation page with pagination in English if number of invitations is greater than 15 and language set to English", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(fifteenAssociationsAwaitingApproval);
        invitationsSpy.mockReturnValue(getPaginatedMockInvitationList(fifteenMockInvitations));

        // When
        const response = await router.get(`${url}?lang=en`);

        // Then
        expect(response.text).toContain(commonEn.next);
    });

    it("should return invitation page with pagination in Welsh if number of invitations is greater than 15 and language set to Welsh", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(fifteenAssociationsAwaitingApproval);
        invitationsSpy.mockReturnValue(getPaginatedMockInvitationList(fifteenMockInvitations));
        // When
        const response = await router.get(`${url}?lang=cy`);

        // Then
        expect(response.text).toContain(commonCy.next);
    });

    it("should return first invitation page with pagination if number of invitations is greater than 15 and the page number set wrongly", async () => {
        // Given
        userAssociationsSpy.mockResolvedValue(fifteenAssociationsAwaitingApproval);
        invitationsSpy.mockReturnValue(getPaginatedMockInvitationList(fifteenMockInvitations));
        // When
        const response = await router.get(`${url}?page=12345`);

        // Then
        expect(response.text).toContain(commonEn.next);
    });
});
