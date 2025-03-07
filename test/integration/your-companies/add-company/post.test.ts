// the order of the mock imports matter
import mocks from "../../../mocks/all.middleware.mock";
import {
    validActiveCompanyProfile,
    validDisolvedCompanyProfile
} from "../../../mocks/companyProfile.mock";
import { Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import app from "../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as commpanyProfileService from "../../../../src/services/companyProfileService";
import * as constants from "../../../../src/constants";
import * as en from "../../../../locales/en/add-company.json";
import * as cy from "../../../../locales/cy/add-company.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import { Session } from "@companieshouse/node-session-handler";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";
import { AssociationState, AssociationStateResponse } from "../../../../src/types/associations";
import * as associationService from "../../../../src/services/associationsService";

const router = supertest(app);
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationService, "isOrWasCompanyAssociatedWithUser");

describe("POST /your-companies/add-company", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        {
            condition: "company number is correct and the company is active and not already associated with the user",
            associationState: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER,
            langVersion: "en"
        },
        {
            condition: "company number is correct and the company is active and not already associated with the user but was associated in the past",
            associationState: AssociationState.COMPANY_WAS_ASSOCIATED_WITH_USER,
            langVersion: "en"
        },
        {
            condition: "company number is correct and the company is active and not already associated with the user",
            associationState: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER,
            langVersion: "cy"
        },
        {
            condition: "company number is correct and the company is active and not already associated with the user but was associated in the past",
            associationState: AssociationState.COMPANY_WAS_ASSOCIATED_WITH_USER,
            langVersion: "cy"
        },
        {
            condition: "company number is correct and the company is active and not already associated with the user",
            associationState: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER,
            langVersion: undefined
        },
        {
            condition: "company number is correct and the company is active and not already associated with the user but was associated in the past",
            associationState: AssociationState.COMPANY_WAS_ASSOCIATED_WITH_USER,
            langVersion: undefined
        }
    ])("should return status 302 if $condition",
        async ({ associationState, langVersion }) => {
            // Given
            companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(associationState);
            // When
            const response = await router.post(`/your-companies/add-company${langVersion ? `?lang=${langVersion}` : ""}`).send({ companyNumber: "12345678" });
            // Then
            expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
        });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "company number is correct but company status is not active",
            companyProfile: validDisolvedCompanyProfile,
            message: en.enter_a_company_number_for_a_company_that_is_active,
            companyNumber: "12345678"
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "company number is correct but company status is not active",
            companyProfile: validDisolvedCompanyProfile,
            message: cy.enter_a_company_number_for_a_company_that_is_active,
            companyNumber: "12345678"
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "company number is correct but company has already been added to user account",
            companyProfile: validActiveCompanyProfile,
            message: en.this_company_has_already_been_added_to_your_account,
            companyNumber: "23456789"
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "company number is correct but company has already been added to user account",
            companyProfile: validActiveCompanyProfile,
            message: cy.this_company_has_already_been_added_to_your_account,
            companyNumber: "23456789"
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "company number is incorrect",
            companyProfileResource: { httpStatusCode: StatusCodes.BAD_REQUEST } as Resource<CompanyProfile>,
            message: en.enter_a_company_number_that_is_8_characters_long,
            companyNumber: "%£$£$£5343"
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "company number is incorrect",
            companyProfileResource: { httpStatusCode: StatusCodes.BAD_REQUEST } as Resource<CompanyProfile>,
            message: cy.enter_a_company_number_that_is_8_characters_long,
            companyNumber: "%£$£$£5343"
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "there is no company with provided number",
            companyProfileResource: { httpStatusCode: StatusCodes.NOT_FOUND } as Resource<CompanyProfile>,
            message: en.enter_a_company_number_that_is_8_characters_long,
            companyNumber: "11111111"
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "there is no company with provided number",
            companyProfileResource: { httpStatusCode: StatusCodes.NOT_FOUND } as Resource<CompanyProfile>,
            message: cy.enter_a_company_number_that_is_8_characters_long,
            companyNumber: "11111111"
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "there is no company number provided",
            companyProfileResource: { httpStatusCode: StatusCodes.NOT_FOUND } as Resource<CompanyProfile>,
            message: en.enter_a_company_number,
            companyNumber: ""
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "there is no company number provided",
            companyProfileResource: { httpStatusCode: StatusCodes.NOT_FOUND } as Resource<CompanyProfile>,
            message: cy.enter_a_company_number,
            companyNumber: ""
        }
    ])("should return expected $langInfo error message if $condition and language version set to '$langVersion'",
        async ({ langVersion, lang, langCommon, companyProfile, condition, message, companyNumber, companyProfileResource }) => {
            // Given
            if (companyProfile) {
                companyProfileSpy.mockReturnValue(companyProfile);
            }
            if (companyProfileResource) {
                companyProfileSpy.mockRejectedValue(companyProfileResource);
            }
            if (condition === "company number is correct but company has already been added to user account") {
                const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "12345678" };
                isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(associationStateResponse);
            }
            // When
            const response = await router.post(`/your-companies/add-company?lang=${langVersion}`).send({ companyNumber });
            // Then
            expect(response.text).toContain(langCommon.back_link);
            expect(response.text).toContain(langCommon.there_is_a_problem);
            expect(response.text).toContain(lang.what_is_the_company_number);
            expect(response.text).toContain(lang.a_company_number_is_8_characters_long);
            expect(response.text).toContain(lang.you_can_find_this_by_searching);
            expect(response.text).toContain(lang.how_do_i_find_the_company_number);
            expect(response.text).toContain(langCommon.continue);
            expect(response.text).toContain(message);
        });

    it("should return expected generic error message if any other error happens", async () => {
        // Given
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_GATEWAY
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=en").send({ companyNumber: "12345678" });
        // Then
        expect(response.text).toContain(enCommon.generic_error_message);
    });

    it("should return company already added error message if user has come from the current page (switched languages)", async () => {
        // Given
        const url = "/your-companies/add-company";
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: url };
            req.session = session;
            next();
        });
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "12345678" };
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(associationStateResponse);
        const companyNumber = "12345678";
        setExtraData(session, constants.CURRENT_COMPANY_NUM, companyNumber);
        // When
        const response = await router.get(url).send({ companyNumber: "12345678" });
        // Then
        expect(response.text).toContain("This company has already been added to your account");
    });
});
