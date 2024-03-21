import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import * as associationsService from "../../../../src/services/associationsService";
import supertest from "supertest";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { AuthorisedPerson } from "../../../../src/types/associations";
import * as en from "../../../../src/locales/en/translation/manage-authorised-people.json";
import * as cy from "../../../../src/locales/cy/translation/manage-authorised-people.json";

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

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-person-added", () => {
    const companyNumber = "NI038379";
    const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-person-added`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
    const sessionUtilsSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const authorisedPerson: AuthorisedPerson = {
        authorisedPersonEmailAddress: "bob@bob.com",
        authorisedPersonCompanyName: "Acme Ltd"
    };
    // sessionUtilsSpy.mockReturnValue(authorisedPerson);
    getCompanyAssociationsSpy.mockReturnValue(companyAssociations);

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379/confirmation-person-added page", async () => {
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        const response = await router.get(url);
        expect(response.status).toEqual(200);
    });

    it("should return expected English content if language version set to English", async () => {
        sessionUtilsSpy.mockReturnValue(authorisedPerson);

        const response = await router.get(`${url}?lang=en`);
        expect(response.text).toContain(en.authorised_person_success_heading);
        expect(response.text).toContain(en.authorised_person_success_msg1);
        expect(response.text).toContain(en.authorised_person_success_msg2);
        expect(response.text).toContain("Acme Ltd");
        expect(response.text).toContain("bob@bob.com");
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        sessionUtilsSpy.mockReturnValue(authorisedPerson);
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.authorised_person_success_heading);
        expect(response.text).toContain(cy.authorised_person_success_msg1);
        expect(response.text).toContain(cy.authorised_person_success_msg2);
        expect(response.text).toContain("Acme Ltd");
        expect(response.text).toContain("bob@bob.com");
    });
    it("should not display banner if no authorised person details saved in session", async () => {
        sessionUtilsSpy.mockReturnValue(undefined);
        const response = await router.get(`${url}?lang=en`);
        expect(response.text.includes(en.authorised_person_success_heading)).toBe(false);
        expect(response.text.includes("Acme Ltd")).toBe(false);
        expect(response.text.includes("bob@bob.com")).toBe(false);
    });
});
