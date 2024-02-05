
// the order of the mock imports matter
import mocks from "../../mocks/all.middleware.mock";
import { validActiveCompanyProfile, validDisolvedCompanyProfile, validSDKResource } from "../../mocks/companyProfile.mock";
import { Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import app from "../../../src/app";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import * as commpanyProfileService from "../../../src/services/companyProfileService";
import * as associationService from "../../../src/services/userCompanyAssociationService";
import errorManifest from "../../../src/lib/utils/error_manifests/default";
import { COMPNANY_ASSOCIATED_WITH_USER, COMPNANY_NOT_ASSOCIATED_WITH_USER } from "../../../src/constants";
import { emptyUserAssociations, userAssociations } from "../../mocks/associations.mock";

const router = supertest(app);

jest.mock("../../../src/lib/Logger");
jest.mock("../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com")
    };
});

describe("GET /your-companies", () => {
    const en = require("../../../src/locales/en/translation/your-companies.json");
    const cy = require("../../../src/locales/cy/translation/your-companies.json");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the your-companies page", async () => {
        await router.get("/your-companies");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get("/your-companies").expect(200);
    });

    it("should return expected English content if no companies added and language version set to English", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(emptyUserAssociations);
        // When
        const response = await router.get("/your-companies?lang=en");
        // Then
        expect(response.text).toContain(en.add_a_company);
        expect(response.text).toContain(en.add_a_company_to_your_account);
        expect(response.text).toContain(en.bullet_list[0]);
        expect(response.text).toContain(en.bullet_list[1]);
        expect(response.text).toContain(en.you_have_not_added_any_companies);
        expect(response.text).toContain(en.your_companies);
        expect(response.text).not.toContain(en.company_name);
        expect(response.text).not.toContain(en.company_number);
        expect(response.text).not.toContain(en.people_digitally_authorised_to_file_online);
    });

    it("should return expected Welsh content if no companies added and language version set to Welsh", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(null);
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain(cy.add_a_company);
        expect(response.text).toContain(cy.add_a_company_to_your_account);
        expect(response.text).toContain(cy.bullet_list[0]);
        expect(response.text).toContain(cy.bullet_list[1]);
        expect(response.text).toContain(cy.you_have_not_added_any_companies);
        expect(response.text).toContain(cy.your_companies);
        expect(response.text).not.toContain(cy.company_name);
        expect(response.text).not.toContain(cy.company_number);
        expect(response.text).not.toContain(cy.people_digitally_authorised_to_file_online);
    });

    it("should return expected English content if companies are added and language version set to English", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(userAssociations);
        // When
        const response = await router.get("/your-companies?lang=en");
        // Then
        expect(response.text).toContain(userAssociations.items[0].companyName);
        expect(response.text).toContain(userAssociations.items[0].companyNumber);
        expect(response.text).toContain(en.view_and_manage);
        expect(response.text).toContain(en.your_companies);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.people_digitally_authorised_to_file_online);
        expect(response.text).toContain(en.add_a_company);
        expect(response.text).toContain(en.your_companies);
        expect(response.text).not.toContain(en.add_a_company_to_your_account);
        expect(response.text).not.toContain(en.bullet_list[0]);
        expect(response.text).not.toContain(en.bullet_list[1]);
        expect(response.text).not.toContain(en.you_have_not_added_any_companies);
    });

    it("should return expected Welsh content if companies are added and language version set to Welsh", async () => {
        // Given
        const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationService, "getUserAssociations");
        userAssociationsSpy.mockReturnValue(userAssociations);
        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain(userAssociations.items[0].companyName);
        expect(response.text).toContain(userAssociations.items[0].companyNumber);
        expect(response.text).toContain(cy.view_and_manage);
        expect(response.text).toContain(cy.your_companies);
        expect(response.text).toContain(cy.company_name);
        expect(response.text).toContain(cy.company_number);
        expect(response.text).toContain(cy.people_digitally_authorised_to_file_online);
        expect(response.text).toContain(cy.add_a_company);
        expect(response.text).toContain(cy.your_companies);
        expect(response.text).not.toContain(cy.add_a_company_to_your_account);
        expect(response.text).not.toContain(cy.bullet_list[0]);
        expect(response.text).not.toContain(cy.bullet_list[1]);
        expect(response.text).not.toContain(cy.you_have_not_added_any_companies);
    });
});

describe("GET /your-companies/add-company", () => {
    const en = require("../../../src/locales/en/translation/add-company.json");
    const cy = require("../../../src/locales/cy/translation/add-company.json");
    const enCommon = require("../../../src/locales/en/translation/common.json");
    const cyCommon = require("../../../src/locales/cy/translation/common.json");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return status 200", async () => {
        await router.get("/your-companies/add-company").expect(200);
    });

    it("should return expected English content if language version set to English", async () => {
        const response = await router.get("/your-companies/add-company?lang=en");
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        const response = await router.get("/your-companies/add-company?lang=cy");
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
    });
});

describe("POST /your-companies/add-company", () => {
    const en = require("../../../src/locales/en/translation/add-company.json");
    const cy = require("../../../src/locales/cy/translation/add-company.json");
    const enCommon = require("../../../src/locales/en/translation/common.json");
    const cyCommon = require("../../../src/locales/cy/translation/common.json");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return status 302 if company number is correct and the company is active and not already associated with the user", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const associationSpy: jest.SpyInstance = jest.spyOn(associationService, "isCompanyAssociatedWithUser");
        associationSpy.mockReturnValue(COMPNANY_NOT_ASSOCIATED_WITH_USER);
        // When
        const response = await router.post("/your-companies/add-company?lang=en");
        // Then
        expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    });

    it("should return expected English error message if company number is correct but company status is not active and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validDisolvedCompanyProfile);
        // When
        const response = await router.post("/your-companies/add-company?lang=en");
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.enter_a_company_number_for_a_company_that_is_active);
    });

    it("should return expected Welsh error message if company number is correct but company status is not active and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validDisolvedCompanyProfile);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy");
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.enter_a_company_number_for_a_company_that_is_active);
    });

    it("should return expected English error message if company number is correct but company has already been added to user account and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const associationSpy: jest.SpyInstance = jest.spyOn(associationService, "isCompanyAssociatedWithUser");
        associationSpy.mockReturnValue(COMPNANY_ASSOCIATED_WITH_USER);
        // When
        const response = await router.post("/your-companies/add-company?lang=en");
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.this_company_has_already_been_added_to_your_account);
    });

    it("should return expected Welsh error message if company number is correct but company has already been added to user account and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const associationSpy: jest.SpyInstance = jest.spyOn(associationService, "isCompanyAssociatedWithUser");
        associationSpy.mockReturnValue(COMPNANY_ASSOCIATED_WITH_USER);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy");
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.this_company_has_already_been_added_to_your_account);
    });

    it("should return expected English error message if company number is incorrect and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_REQUEST
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=en");
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.enter_a_company_number_that_is_8_characters_long);
    });

    it("should return expected Welsh error message if company number is incorrect and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_REQUEST
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy");
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.enter_a_company_number_that_is_8_characters_long);
    });

    it("should return expected English error message if there is no company with provided number and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.NOT_FOUND
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=en");
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.enter_a_company_number_that_is_8_characters_long);
    });

    it("should return expected Welsh error message if there is no company with provided number and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.NOT_FOUND
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy");
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.enter_a_company_number_that_is_8_characters_long);
    });

    it("should return expected generic error message if any other error happens", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_GATEWAY
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company");
        // Then
        expect(response.text).toContain(errorManifest.generic.serverError.summary);
    });
});
