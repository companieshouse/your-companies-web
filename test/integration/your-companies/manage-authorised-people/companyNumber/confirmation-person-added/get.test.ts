import mocks from "../../../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../../../mocks/associations.mock";
import app from "../../../../../../src/app";
import * as associationsService from "../../../../../../src/services/associationsService";
import supertest from "supertest";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import { AssociationState, AssociationStateResponse, AuthorisedPerson } from "../../../../../../src/types/associations";
import * as referrerUtils from "../../../../../../src/lib/utils/referrerUtils";
import { LANDING_URL } from "../../../../../../src/constants";
import en from "../../../../../../locales/en/manage-authorised-people.json";
import cy from "../../../../../../locales/cy/manage-authorised-people.json";
import { Request, Response } from "express";

const router = supertest(app);

jest.mock("../../../../../../src/lib/Logger");
jest.mock("../../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn(),
        deleteExtraData: jest.fn()
    };
});

const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-person-added", () => {
    const companyNumber = "NI038379";
    const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-person-added`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
    const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
    const isAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "" };
    const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
    const authorisedPerson: AuthorisedPerson = {
        authorisedPersonEmailAddress: "bob@bob.com",
        authorisedPersonCompanyName: "Acme Ltd"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
        redirectPageSpy.mockReturnValue(false);
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379/confirmation-person-added page",
        async () => {
            // Given
            getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
            // When
            await router.get(url);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "English", langVersion: undefined, lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return status 200 and expected $langInfo content if language version set to $langVersion",
        async ({ langVersion, lang }) => {
            // Given
            sessionUtilsSpy.mockReturnValue(authorisedPerson);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.authorised_person_success_heading);
            expect(response.text).toContain(lang.authorised_person_success_msg1);
            expect(response.text).toContain(lang.authorised_person_success_msg2);
            expect(response.text).toContain("Acme Ltd");
            expect(response.text).toContain("bob@bob.com");
        });

    it("should not display banner if no authorised person details saved in session", async () => {
        // Given
        sessionUtilsSpy.mockReturnValue(undefined);
        // When
        const response = await router.get(`${url}?lang=en`);
        // Then
        expect(response.text.includes(en.authorised_person_success_heading)).toBe(false);
        expect(response.text.includes("Acme Ltd")).toBe(false);
        expect(response.text.includes("bob@bob.com")).toBe(false);
    });

    it("should return status 302 and correct response message including desired url path on page redirect", async () => {
        // Given
        const urlPath = LANDING_URL;
        mocks.mockNavigationMiddleware.mockImplementation((req: Request, res: Response) => {
            res.redirect(urlPath);
        });
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);

    });
});
