import mocks from "../../../mocks/all.middleware.mock";
import { associationsWithInvitations, userAssociations, userAssociationsWithEmptyInvitations } from "../../../mocks/associations.mock";
import { userRecords } from "../../../mocks/userService.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as en from "../../../../src/locales/en/translation/company-invitations.json";
import * as cy from "../../../../src/locales/cy/translation/company-invitations.json";
import { getUserAssociations } from "../../../../src/services/userCompanyAssociationService";
import { getUserRecord } from "../../../../src/services/userService";
import { Associations } from "../../../../src/types/associations";
jest.mock("../../../../src/services/userCompanyAssociationService");
jest.mock("../../../../src/services/userService");

const mockGetUserAssociations = getUserAssociations as jest.Mock;
const mockGetUserRecord = getUserRecord as jest.Mock;

const router = supertest(app);
const url = "/your-companies/company-invitations";

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetUserAssociations.mockResolvedValue(associationsWithInvitations);
        mockGetUserRecord.mockResolvedValue(userRecords[3]);
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

    it("should return an empty table if no invitation awaiting approval exists", async () => {
        // Given
        mockGetUserAssociations.mockResolvedValue(userAssociations);
        const expectedNotContainEmail = "another.email@acme.com";
        const expectedNotContainCompanyNumber1 = "NI038379";
        const expectedNotContainCompanyName1 = "THE POLISH BREWERY";
        const expectedNotContainCompanyNumber2 = "01777777";
        const expectedNotContainCompanyName2 = "BRITISH AIRWAYS PLC";

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.invited_by);
        expect(response.text).not.toContain(expectedNotContainEmail);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber1);
        expect(response.text).not.toContain(expectedNotContainCompanyName1);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber2);
        expect(response.text).not.toContain(expectedNotContainCompanyName2);
    });

    it("should return an empty table if no invitation provided", async () => {
        // Given
        mockGetUserAssociations.mockResolvedValue({} as Associations);
        const expectedNotContainEmail = "another.email@acme.com";
        const expectedNotContainCompanyNumber1 = "NI038379";
        const expectedNotContainCompanyName1 = "THE POLISH BREWERY";
        const expectedNotContainCompanyNumber2 = "01777777";
        const expectedNotContainCompanyName2 = "BRITISH AIRWAYS PLC";

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.invited_by);
        expect(response.text).not.toContain(expectedNotContainEmail);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber1);
        expect(response.text).not.toContain(expectedNotContainCompanyName1);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber2);
        expect(response.text).not.toContain(expectedNotContainCompanyName2);
    });

    it("should return an empty table if invitation empty", async () => {
        // Given
        mockGetUserAssociations.mockResolvedValue(userAssociationsWithEmptyInvitations);
        const expectedNotContainEmail = "another.email@acme.com";
        const expectedNotContainCompanyNumber1 = "NI038379";
        const expectedNotContainCompanyName1 = "THE POLISH BREWERY";
        const expectedNotContainCompanyNumber2 = "01777777";
        const expectedNotContainCompanyName2 = "BRITISH AIRWAYS PLC";

        // When
        const response = await router.get(url);

        // Then
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.invited_by);
        expect(response.text).not.toContain(expectedNotContainEmail);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber1);
        expect(response.text).not.toContain(expectedNotContainCompanyName1);
        expect(response.text).not.toContain(expectedNotContainCompanyNumber2);
        expect(response.text).not.toContain(expectedNotContainCompanyName2);
    });
});
