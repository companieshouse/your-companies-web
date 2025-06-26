import mocks from "../../../../../mocks/all.middleware.mock";
import app from "../../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../../src/constants";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as associationsService from "../../../../../../src/services/associationsService";
import { userAssociationWithMrigratedCompanyStatus } from "../../../../../mocks/associations.mock";
import { CompanyNameAndNumber } from "../../../../../../src/types/utilTypes";
import * as referrerUtils from "../../../../../../src/lib/utils/referrerUtils";

const router = supertest(app);
const url = "/your-companies/company/12345678/try-restoring-your-digital-authorisation";

jest.mock("../../../../../../src/lib/Logger");
jest.mock("../../../../../../src/lib/utils/sessionUtils");
jest.mock("../../../../../../src/services/associationsService");

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getUserAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");
const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

describe("GET /your-companies/company/12345678/try-restoring-your-digital-authorisation", () => {
    it("should return status 302 and correct response message including desired url path on page redirect", async () => {
        // Given
        const confirmedCompanyForAssociation: CompanyNameAndNumber = {
            companyName: userAssociationWithMrigratedCompanyStatus.items[0].companyName,
            companyNumber: userAssociationWithMrigratedCompanyStatus.items[0].companyNumber
        };
        getExtraDataSpy.mockReturnValue(confirmedCompanyForAssociation);
        getUserAssociationsSpy.mockReturnValue(userAssociationWithMrigratedCompanyStatus);
        const urlPath = `${constants.LANDING_URL}${(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL)}`;
        redirectPageSpy.mockReturnValue(false);
        // When
        const response = await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.statusCode).toEqual(302);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    it("should return status 302 and redirect to the landing page if the URL accessed directly or from the wrong referer", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(`Found. Redirecting to ${constants.LANDING_URL}`);
    });
});
