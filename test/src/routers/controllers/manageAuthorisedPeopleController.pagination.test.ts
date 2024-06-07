import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociationsPage2, companyAssociationsPage1 } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import * as associationsService from "../../../../src/services/associationsService";
import supertest from "supertest";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as cyCommon from "../../../../src/locales/cy/translation/common.json";

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

const companyNumber = "NI038379";

describe("GET /your-companies/manage-authorised-people/:companyNumber", () => {
    const url = `/your-companies/manage-authorised-people/${companyNumber}`;
    const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379 page", async () => {
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage1));
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should display all 15 associations for page 1 with a next button", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage1));
        // When
        const response = await router.get(`${url}`);
        // Then
        companyAssociationsPage1.items.forEach((association) => {
            expect(response.text).toContain(association.userEmail + "</th>");
        });
        expect(response.text).toContain(enCommon.next);
        expect(response.text).not.toContain(enCommon.previous);
    });

    it("should display the assocations for the last paginated page", async () => {
        // Given
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(companyAssociationsPage2));
        // When
        const response = await router.get(`${url}?page=2`);
        // Then
        companyAssociationsPage2.items.forEach((association) => {
            expect(response.text).toContain(association.userEmail + "</th>");
        });
        expect(response.text).not.toContain(enCommon.next);
        expect(response.text).toContain(enCommon.previous);
    });
    it("should not display pagination when there is one page of associations", async () => {
        // Given
        const mockCompanyAssociations = { ...companyAssociationsPage1 };
        mockCompanyAssociations.totalPages = 1;
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(mockCompanyAssociations));
        // When
        const response = await router.get(`${url}?page=2`);
        // Then
        expect(response.text).not.toContain(enCommon.next);
        expect(response.text).not.toContain(enCommon.previous);
    });
    it("should display the pagination links in welsh", async () => {
        // Given
        const mockCompanyAssociations = { ...companyAssociationsPage1 };
        mockCompanyAssociations.totalPages = 10;
        getCompanyAssociationsSpy.mockReturnValue(Promise.resolve(mockCompanyAssociations));
        // When
        const response = await router.get(`${url}?page=4&lang=cy`);
        // Then
        expect(response.text).toContain(cyCommon.next);
        expect(response.text).toContain(cyCommon.previous);
    });
});
