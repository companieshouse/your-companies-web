import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import * as userCompanyAssociationService from "../../../../src/services/userCompanyAssociationService";
import supertest from "supertest";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { CONFIRM, USER_REMOVED_FROM_COMPANY_ASSOCIATIONS, YES } from "../../../../src/constants";
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

const en = require("../../../../src/locales/en/translation/manage-authorised-people.json");
const cy = require("../../../../src/locales/cy/translation/manage-authorised-people.json");
const enCommon = require("../../../../src/locales/en/translation/common.json");
const cyCommon = require("../../../../src/locales/cy/translation/common.json");
const companyNumber = "NI038379";

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-person-removed", () => {
    const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-person-removed`;
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

    it("should return expected English content if person removed, their name not provided and language version set to English", async () => {
    // Given
        const removal: Removal = {
            removePerson: CONFIRM,
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
            removePerson: CONFIRM,
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
            removePerson: CONFIRM,
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
            removePerson: CONFIRM,
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
