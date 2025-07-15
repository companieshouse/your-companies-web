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
import en from "../../../../locales/en/company-invitations.json";
import cy from "../../../../locales/cy/company-invitations.json";
import * as commonEn from "../../../../locales/en/common.json";
import * as commonCy from "../../../../locales/cy/common.json";
import * as associationsService from "../../../../src/services/associationsService";
import { AssociationStatus, AssociationList } from "@companieshouse/api-sdk-node/dist/services/associations/types";

const router = supertest(app);
const url = "/your-companies/company-invitations";

jest.mock("../../../../src/lib/Logger");
const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
const invitationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getInvitations");

describe("GET /your-companies/company-invitations", () => {
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

    test.each([
        // Given
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "English", langVersion: undefined, lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return expected $langInfo content if language set to $langVersion",
        async ({ langVersion, lang }) => {
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(lang.h1);
            expect(response.text).toContain(lang.company_name);
            expect(response.text).toContain(lang.company_number);
            expect(response.text).toContain(lang.invited_by);
            expect(response.text).toContain(lang.accept);
            expect(response.text).toContain(lang.decline);
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

    test.each([
        { langInfo: "English", langVersion: "en", lang: en, conditon: "no invitation awaiting approval exists", associations: userAssociations },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, conditon: "no invitation awaiting approval exists", associations: userAssociations },
        { langInfo: "English", langVersion: "en", lang: en, conditon: "no invitation provided", associations: {} as AssociationList },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, conditon: "no invitation provided", associations: {} as AssociationList },
        { langInfo: "English", langVersion: "en", lang: en, conditon: "invitation empty", associations: userAssociationsWithEmptyInvitations },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, conditon: "invitation empty", associations: userAssociationsWithEmptyInvitations }
    ])("should return an expected text if $condition and language set to English",
        async ({ langVersion, lang, associations }) => {
            // Given
            userAssociationsSpy.mockResolvedValue(associations);
            invitationsSpy.mockResolvedValue(getMockInvitationList([]));
            const expectedNotContainEmail = "another.email@acme.com";
            const expectedNotContainCompanyNumber1 = "NI038379";
            const expectedNotContainCompanyName1 = "THE POLISH BREWERY";
            const expectedNotContainCompanyNumber2 = "01777777";
            const expectedNotContainCompanyName2 = "BRITISH AIRWAYS PLC";

            // When
            const response = await router.get(`${url}?lang=${langVersion}`);

            // Then
            expect(response.text).toContain(lang.h1);
            expect(response.text).toContain(lang.no_pending_invitations);
            expect(response.text).not.toContain(lang.company_name);
            expect(response.text).not.toContain(lang.company_number);
            expect(response.text).not.toContain(lang.invited_by);
            expect(response.text).not.toContain(expectedNotContainEmail);
            expect(response.text).not.toContain(expectedNotContainCompanyNumber1);
            expect(response.text).not.toContain(expectedNotContainCompanyName1);
            expect(response.text).not.toContain(expectedNotContainCompanyNumber2);
            expect(response.text).not.toContain(expectedNotContainCompanyName2);
        });

    test.each([
        { langInfo: "English", langVersion: "en", lang: commonEn },
        { langInfo: "English", langVersion: undefined, lang: commonEn },
        { langInfo: "Welsh", langVersion: "cy", lang: commonCy }
    ])("should return invitation page with pagination in $langInfo if number of invitations is greater than 15 and language set to '$langVersion'",
        async ({ langVersion, lang }) => {
            // Given
            userAssociationsSpy.mockResolvedValue(fifteenAssociationsAwaitingApproval);
            invitationsSpy.mockReturnValue(getPaginatedMockInvitationList(fifteenMockInvitations));

            // When
            const response = await router.get(`${url}?lang=${langVersion}`);

            // Then
            expect(response.text).toContain(lang.next);
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
