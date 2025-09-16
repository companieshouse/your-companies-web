
// the order of the mock imports matter
import mocks from "../../mocks/all.middleware.mock";
import app from "../../../src/app";
import supertest from "supertest";
import * as associationsService from "../../../src/services/associationsService";
import {
    emptyAssociations,
    migratedAssociation,
    oneConfirmedAssociation,
    twentyConfirmedAssociations,
    userAssociations,
    userAssociationsWithNumberOfInvitations
} from "../../mocks/associations.mock";
import en from "../../../locales/en/your-companies.json";
import cy from "../../../locales/cy/your-companies.json";
import enCommon from "../../../locales/en/common.json";
import cyCommon from "../../../locales/cy/common.json";
import { getExtraData, setExtraData } from "../../../src/lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";

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
            expect(response.text).not.toContain(lang.company_number);
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
            expect(response.text).toContain(lang.company_number);
            expect(response.text).toContain(lang.add_a_company);
            expect(response.text).toContain(lang.your_companies);
            expect(response.text).not.toContain(lang.add_a_company_to_your_account);
            expect(response.text).not.toContain(lang.bullet_list[0]);
            expect(response.text).not.toContain(lang.bullet_list[1]);
            expect(response.text).not.toContain(lang.you_have_not_added_any_companies);
            expect(response.text).not.toContain(expectedText);
        });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "English", langVersion: undefined, lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should display $langInfo version of a banner with information about number of invitations if language version set to '$langVersion'",
        async ({ langVersion, lang }) => {
            // Given
            userAssociationsSpy.mockReturnValue(userAssociationsWithNumberOfInvitations);
            getInvitationsSpy.mockReturnValue(userAssociationsWithNumberOfInvitations);
            const expectedText = lang.view_invitations + " " + "&#40;" +
                userAssociationsWithNumberOfInvitations.totalResults + "&#41;";
            // When
            const response = await router.get(`/your-companies?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(expectedText);
        });

    test.each([
        { deletionInfo: "the manage authorised people page indicator", key: "manageAuthorisedPeopleIndicator" },
        { deletionInfo: "the confirm company details page indicator", key: "confirmCompanyDetailsIndicator" }
    ])("should delete $deletionInfo in extraData on page load",
        async ({ key }) => {
            // Given
            userAssociationsSpy.mockReturnValueOnce(userAssociations);
            getInvitationsSpy.mockReturnValueOnce(userAssociationsWithNumberOfInvitations);
            const value = true;
            setExtraData(session, key, value);
            const data = getExtraData(session, key);

            // When
            await router.get("/your-companies");
            const resultData = getExtraData(session, key);

            // Then
            expect(data).toBeTruthy();
            expect(resultData).toBeUndefined();
        });
    it("should display 'Not digitally authorised' when association has status of migrated", async () => {
        // Give
        userAssociationsSpy.mockResolvedValue(migratedAssociation);
        getInvitationsSpy.mockResolvedValue(oneConfirmedAssociation);
        // When
        const response = await router.get("/your-companies?lang=en");
        // Then
        expect(response.text).toContain(en.not_authorised);
        expect(response.text).not.toContain(en.authorised);
    });
    it("should display 'Digitally authorised' when association has status of confirmed", async () => {
        // Give
        userAssociationsSpy.mockResolvedValue(oneConfirmedAssociation);
        getInvitationsSpy.mockResolvedValue(emptyAssociations);
        // When
        const response = await router.get("/your-companies");
        // Then
        expect(response.text).toContain(en.authorised);
        expect(response.text).not.toContain(en.not_authorised);
    });
    test.each([
        { langVersion: "en", lang: en, langCommon: enCommon },
        { langVersion: undefined, lang: en, langCommon: enCommon },
        { langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return pagination if more than 15 companies returned and lang set to '$langVersion'",
        async ({ langVersion, lang, langCommon }) => {
            // Given
            userAssociationsSpy.mockResolvedValue(twentyConfirmedAssociations);
            getInvitationsSpy.mockResolvedValue(oneConfirmedAssociation);
            // When
            const response = await router.get(`/your-companies?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(lang.search);
            expect(response.text).toContain(langCommon.next);
        });

    it("should return selected page", async () => {
        // Give
        userAssociationsSpy.mockResolvedValue(twentyConfirmedAssociations);
        getInvitationsSpy.mockResolvedValue(oneConfirmedAssociation);

        // When
        const response = await router.get("/your-companies?page=2&lang=en");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(enCommon.previous);
        expect(response.text).not.toContain(enCommon.next);
    });

    it("should ignore incorrect page numbers", async () => {
        // Give
        userAssociationsSpy.mockResolvedValue(twentyConfirmedAssociations);
        getInvitationsSpy.mockResolvedValue(twentyConfirmedAssociations);
        // When
        const response = await router.get("/your-companies?page=abc");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(enCommon.next);
        expect(response.text).not.toContain(enCommon.previous);
    });

    it("should display company when company number provided and match is found", async () => {
        // Give
        userAssociationsSpy.mockResolvedValue(oneConfirmedAssociation);
        getInvitationsSpy.mockResolvedValue(oneConfirmedAssociation);
        // When
        const response = await router.get("/your-companies?search=NI03837");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(en.result);
        expect(response.text).toContain("THE POLISH BREWERY");
        expect(response.text).toContain("NI038379");
        expect(response.text).not.toContain(enCommon.next);
    });

    it("should display no matches when no matches found", async () => {
        // Give
        userAssociationsSpy.mockResolvedValue(emptyAssociations);
        getInvitationsSpy.mockResolvedValue(oneConfirmedAssociation);
        // When
        const response = await router.get("/your-companies?search=ABCDEF");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(en.no_results_found);
    });

    test.each([
        { langVersion: "en", lang: en, langCommon: enCommon },
        { langVersion: undefined, lang: en, langCommon: enCommon },
        { langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("shoud display $langInfo error message and default table of associations if search value not following company number format and language set to '$langVersion",
        async ({ langVersion, lang, langCommon }) => {
            // Give
            userAssociationsSpy.mockResolvedValue(twentyConfirmedAssociations);
            getInvitationsSpy.mockResolvedValue(twentyConfirmedAssociations);
            // When
            const response = await router.get(`/your-companies?lang=${langVersion}&search=kskkskskx`);
            // Then
            expect(response.text).toContain(lang.company_number_must_only_include);
            expect(response.text).toContain(langCommon.next);
        });
});
