import mocks from "../../../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../../../mocks/associations.mock";
import app from "../../../../../../src/app";
import * as associationsService from "../../../../../../src/services/associationsService";
import supertest from "supertest";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as referrerUtils from "../../../../../../src/lib/utils/referrerUtils";
import en from "../../../../../../locales/en/manage-authorised-people.json";
import cy from "../../../../../../locales/cy/manage-authorised-people.json";
import enCommon from "../../../../../../locales/en/common.json";
import cyCommon from "../../../../../../locales/cy/common.json";
import * as constants from "../../../../../../src/constants";
import { when } from "jest-when";
import { AssociationState, AssociationStateResponse } from "../../../../../../src/types/associations";
import { mockAwaitingApprovalRemoval, mockConfirmedRemoval, mockMigratedRemoval } from "../../../../../mocks/removal.mock";

const router = supertest(app);

jest.mock("../../../../../../src/lib/Logger");
jest.mock("../../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn(),
        getExtraData: jest.fn(),
        deleteExtraData: jest.fn()
    };
});

const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-person-removed", () => {
    const companyNumber = "NI038379";
    const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-person-removed`;
    const isAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "" };
    const expectedCompanyAssociations = Object.assign({}, companyAssociations);

    beforeEach(() => {
        jest.clearAllMocks();
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
        redirectPageSpy.mockReturnValue(false);
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379 page", async () => {
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            langCommon: enCommon,
            condition: "person who had a confirmed status removed in English",
            removal: mockConfirmedRemoval,
            expectedBannerHeaderText: mockConfirmedRemoval.userName + en.is_no_longer_digitally_authorised + companyAssociations.items[0].companyName,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[1].userEmail, companyAssociations.items[2].userEmail, companyAssociations.items[3].userEmail]
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            langCommon: cyCommon,
            condition: "person who had a confirmed status removed in Welsh",
            removal: mockConfirmedRemoval,
            expectedBannerHeaderText: mockConfirmedRemoval.userName + cy.is_no_longer_digitally_authorised + companyAssociations.items[0].companyName,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[1].userEmail, companyAssociations.items[2].userEmail, companyAssociations.items[3].userEmail]
        },
        {
            langInfo: "English",
            langVersion: "en",
            langCommon: enCommon,
            condition: "person removed with status migrated in English",
            removal: mockMigratedRemoval,
            expectedBannerHeaderText: en.you_have_confirmed_you_do_not + mockMigratedRemoval.userName,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[1].userEmail, companyAssociations.items[2].userEmail, companyAssociations.items[3].userEmail]
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            langCommon: cyCommon,
            condition: "person removed with status migrated in Welsh",
            removal: mockMigratedRemoval,
            expectedBannerHeaderText: cy.you_have_confirmed_you_do_not + mockMigratedRemoval.userName,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[1].userEmail, companyAssociations.items[2].userEmail, companyAssociations.items[3].userEmail]
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "person removed that had status awaiting approval in English",
            removal: mockAwaitingApprovalRemoval,
            expectedBannerHeaderText: en.you_have_successfully_cancelled_digital_authorisation_start,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[1].userEmail, companyAssociations.items[2].userEmail]
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "person removed that had status awaiting approval in Welsh",
            removal: mockAwaitingApprovalRemoval,
            expectedBannerHeaderText: cy.you_have_successfully_cancelled_digital_authorisation_start,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[1].userEmail, companyAssociations.items[2].userEmail]
        }
    ])("should return expected $langInfo content if $condition and language version set to $langVersion",
        async ({ langVersion, langCommon, removal, expectedBannerHeaderText, emails }) => {
            // Given
            expectedCompanyAssociations.items = companyAssociations.items;
            getCompanyAssociationsSpy.mockReturnValue(expectedCompanyAssociations);
            when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.REMOVE_PERSON).mockReturnValue(removal);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(langCommon.success);
            expect(response.text).toContain(expectedBannerHeaderText);

            for (const email of emails) {
                expect(response.text).toContain(email + "</td>");
            }
        });

    it("should return status 302", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
    });

});
