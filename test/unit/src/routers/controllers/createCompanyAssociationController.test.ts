import { Request, Response } from "express";
import { createCompanyAssociationControllerGet } from "../../../../../src/routers/controllers/createCompanyAssociationController";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { validActiveCompanyProfile } from "../../../../mocks/companyProfile.mock";
import { CompanyNameAndNumber } from "../../../../../src/types/utilTypes";
import * as associationService from "../../../../../src/services/associationsService";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";

jest.mock("../../../../../src/services/associationsService");
const req: Request = mockRequest();
req.session = new Session();
const res: Response = mockResponse();
const redirectMock = jest.fn();
res.redirect = redirectMock;
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const createAssociationSpy: jest.SpyInstance = jest.spyOn(associationService, "createAssociation");
const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");

describe("createCompanyAssociationControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render company invitations page", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(validActiveCompanyProfile);
        const confirmedCompanyForAssocation: CompanyNameAndNumber = {
            companyNumber: validActiveCompanyProfile.companyNumber,
            companyName: validActiveCompanyProfile.companyName
        };
        const expectedUrl = "/test/test-url";
        getFullUrlSpy.mockReturnValue(expectedUrl);
        // When
        await createCompanyAssociationControllerGet(req as Request, res as Response);
        // Then
        expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        expect(createAssociationSpy).toHaveBeenCalledTimes(1);
        expect(createAssociationSpy).toHaveBeenCalledWith(req, confirmedCompanyForAssocation.companyNumber);
        expect(getFullUrlSpy).toHaveBeenCalledTimes(1);
        expect(getFullUrlSpy).toHaveBeenCalledWith(constants.COMPANY_ADDED_SUCCESS_URL);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).toHaveBeenCalledWith(expectedUrl);
    });
});
