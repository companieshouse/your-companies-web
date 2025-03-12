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
import { removalWithoutUserName, removalWithUserName } from "../../../../../mocks/removal.mock";

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
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
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
            lang: en,
            langCommon: enCommon,
            condition: "person removed, their name not provided",
            removal: removalWithoutUserName,
            isRemoved: undefined,
            expectedBannerHeaderText: companyAssociations.items[1].userEmail + en.is_no_longer_digitally_authorised + companyAssociations.items[1].companyName,
            userInfo: companyAssociations.items[1].userEmail,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[2].userEmail, companyAssociations.items[3].userEmail],
            excludeEmail: companyAssociations.items[1].userEmail
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "person removed, their name not provided",
            removal: removalWithoutUserName,
            isRemoved: undefined,
            expectedBannerHeaderText: companyAssociations.items[1].userEmail + cy.is_no_longer_digitally_authorised + companyAssociations.items[1].companyName,
            userInfo: companyAssociations.items[1].userEmail,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[2].userEmail, companyAssociations.items[3].userEmail],
            excludeEmail: companyAssociations.items[1].userEmail
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "person already removed, their name not provided",
            removal: removalWithoutUserName,
            isRemoved: constants.TRUE,
            expectedBannerHeaderText: companyAssociations.items[1].userEmail + en.is_no_longer_digitally_authorised + companyAssociations.items[1].companyName,
            userInfo: companyAssociations.items[1].userEmail,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[2].userEmail, companyAssociations.items[3].userEmail],
            excludeEmail: companyAssociations.items[1].userEmail
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "person already removed, their name not provided",
            removal: removalWithoutUserName,
            isRemoved: constants.TRUE,
            expectedBannerHeaderText: companyAssociations.items[1].userEmail + cy.is_no_longer_digitally_authorised + companyAssociations.items[1].companyName,
            userInfo: companyAssociations.items[1].userEmail,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[2].userEmail, companyAssociations.items[3].userEmail],
            excludeEmail: companyAssociations.items[1].userEmail
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "person removed, their name provided",
            removal: removalWithUserName,
            isRemoved: undefined,
            expectedBannerHeaderText: companyAssociations.items[3].displayName + en.is_no_longer_digitally_authorised + companyAssociations.items[3].companyName,
            userInfo: companyAssociations.items[3].displayName,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[1].userEmail, companyAssociations.items[2].userEmail],
            excludeEmail: companyAssociations.items[3].userEmail
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "person removed, their name provided",
            removal: removalWithUserName,
            isRemoved: undefined,
            expectedBannerHeaderText: companyAssociations.items[3].displayName + cy.is_no_longer_digitally_authorised + companyAssociations.items[3].companyName,
            userInfo: companyAssociations.items[3].displayName,
            emails: [companyAssociations.items[0].userEmail, companyAssociations.items[1].userEmail, companyAssociations.items[2].userEmail],
            excludeEmail: companyAssociations.items[3].userEmail
        }
    ])("should return expected $langInfo content if $condition and language version set to $langVersion",
        async ({ langVersion, lang, langCommon, removal, isRemoved, expectedBannerHeaderText, userInfo, emails, excludeEmail }) => {
            // Given
            expectedCompanyAssociations.items = companyAssociations.items.filter(item => item.userEmail !== removal.userEmail);
            getCompanyAssociationsSpy.mockReturnValue(expectedCompanyAssociations);
            when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.REMOVE_PERSON).mockReturnValue(removal);
            when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS).mockReturnValue(isRemoved);
            removeUserFromCompanyAssociationsSpy.mockReturnValue(constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(langCommon.success);
            expect(response.text).toContain(expectedBannerHeaderText);
            expect(response.text).toContain(lang.weve_sent_an_email_to_the_company);
            expect(response.text).toContain(lang.you_may_wish_to);
            expect(response.text).toContain(lang.change_the_authentication_code);
            expect(response.text).toContain(lang.for_this_company_if + userInfo + lang.still_has_access_to_it);
            for (const email of emails) {
                expect(response.text).toContain(email + "</th>");
            }
            expect(response.text).not.toContain(excludeEmail + "</th>");
        });

    it("should return status 302 on page redirect", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
    });

    it("should return correct response message including desired url path", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
