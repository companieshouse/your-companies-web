import { Request, Response } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as genericValidation from "../../../../../../src/lib/validation/generic";
// import * as companyProfileService from "../../../../../../src/services/companyProfileService";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as constants from "../../../../../../src/constants";
import { mockRequest } from "../../../../../mocks/request.mock";
import { mockResponse } from "../../../../../mocks/response.mock";
import { validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import { AssociationState } from "../../../../../../src/types/associations";
import { AddCompanyHandler } from "../../../../../../src/routers/handlers/yourCompanies/addCompanyHandler";
import { getCompanyProfile } from "../../../../../../src/services/companyProfileService";

jest.mock("../../../../../../src/services/companyProfileService");
jest.mock("../../../../../../src/lib/Logger");
jest.mock("../../../../../../src/lib/utils/sessionUtils");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const validateClearFormSpy: jest.SpyInstance = jest.spyOn(genericValidation, "validateClearForm");
// const getCompanyProfileSpy: jest.SpyInstance = jest.spyOn(companyProfileService, "getCompanyProfile");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const req: Request = mockRequest();
const res: Response = mockResponse();

describe("AddCompanyHandler", () => {
    const addCompanyHandler: AddCompanyHandler = new AddCompanyHandler();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        {
            referer: "",
            isClearForm: true,
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validActiveCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber
            }
        }
    ])("should return expected viewData object if method is $method",
        async ({ referer, isClearForm, body, query, companyProfile, method, isAssociated, viewData }) => {
            // Given
            req.headers.referer = referer;
            req.body = body;
            req.query = query;
            getTranslationsForViewSpy.mockReturnValue({ test: "Test" });
            validateClearFormSpy.mockReturnValue(isClearForm);
            (getCompanyProfile as jest.Mock).mockReturnValue(companyProfile);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
            // When
            const response = await addCompanyHandler.execute(req, res, method);
            // Then
            expect(response).toEqual(viewData);
        });
});
