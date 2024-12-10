import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../locales/en/remove-company.json";
import * as cy from "../../../../locales/cy/remove-company.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import { setExtraData, getExtraData } from "../../../../src/lib/utils/sessionUtils";
import { getCompanyProfile } from "../../../../src/services/companyProfileService";
import * as associationsService from "../../../../src/services/associationsService";
import { getFullUrl } from "../../../../src/lib/utils/urlUtils";

const router = supertest(app);
const companyNumber = "123456";
const companyName = "Test Company Ltd";
const url = `/your-companies/remove-company/${companyNumber}`;
const session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => ({
    ...jest.requireActual("../../../../src/lib/utils/sessionUtils"),
    setExtraData: jest.fn(),
    getExtraData: jest.fn()
}));

jest.mock("../../../../src/services/companyProfileService");

jest.mock("../../../../src/services/associationsService", () => ({
    ...jest.requireActual("../../../../src/services/associationsService"),
    isOrWasCompanyAssociatedWithUser: jest.fn(),
    removeUserFromCompanyAssociations: jest.fn()
}));

describe("GET /your-companies/remove-company", () => {
    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

    beforeEach(() => {
        jest.clearAllMocks();
        (setExtraData as jest.Mock).mockImplementation((session, key, value) => {
            session.data[key] = value;
        });
        (getExtraData as jest.Mock).mockImplementation((session, key) => session.data[key]);
        setExtraData(session, constants.COMPANY_NAME, companyName);
        setExtraData(session, constants.COMPANY_NUMBER, companyNumber);

        (getCompanyProfile as jest.Mock).mockResolvedValue({
            companyName: companyName,
            companyNumber: companyNumber
        });
    });

    redirectPageSpy.mockReturnValue(false);

    it("should check session and auth before returning the remove company page", async () => {
        // Given
        const request = router.get(url);

        // When
        await request;

        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(getCompanyProfile).toHaveBeenCalledWith(companyNumber);
    });

    it("should return status 200 for remove company page", async () => {
        // Given
        const request = router.get(url);

        // When
        const response = await request;

        // Then
        expect(response.status).toBe(200);
    });

    it("should return expected English content if language version set to English", async () => {
        // Given
        const request = router.get(`${url}?lang=en`);

        // When
        const response = await request;

        // Then
        expect(response.text).toContain(en.title_remove_company);
        expect(response.text).toContain(companyName);
        expect(response.text).toContain(companyNumber);
        expect(response.text).toContain(en.are_you_sure_you_want_to_remove_company);
        expect(response.text).toContain(enCommon.yes);
        expect(response.text).toContain(enCommon.no);
        expect(response.text).toContain(enCommon.continue);
        expect(getCompanyProfile).toHaveBeenCalledWith(companyNumber);
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        // Given
        const request = router.get(`${url}?lang=cy`);

        // When
        const response = await request;

        // Then
        expect(response.text).toContain(cy.title_remove_company);
        expect(response.text).toContain(companyName);
        expect(response.text).toContain(companyNumber);
        expect(response.text).toContain(cy.are_you_sure_you_want_to_remove_company);
        expect(response.text).toContain(cyCommon.yes);
        expect(response.text).toContain(cyCommon.no);
        expect(response.text).toContain(cyCommon.continue);
        expect(getCompanyProfile).toHaveBeenCalledWith(companyNumber);
    });

    it("should return error in page content if error exists in session data", async () => {
        // Given
        setExtraData(session, constants.YOU_MUST_SELECT_AN_OPTION, en.you_must_select_an_option);
        const request = router.get(url);

        // When
        const response = await request;

        // Then
        expect(response.text).toContain(en.you_must_select_an_option);
    });

    it("should return correct response message to /your-companies for remove-company page redirection", async () => {
        redirectPageSpy.mockReturnValue(true);
        // Given
        const urlPath = constants.LANDING_URL;
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

});

describe("POST /your-companies/remove-company", () => {
    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
    beforeEach(() => {
        jest.clearAllMocks();
        (setExtraData as jest.Mock).mockImplementation((session, key, value) => {
            session.data[key] = value;
        });
        (getExtraData as jest.Mock).mockImplementation((session, key) => session.data[key]);
        setExtraData(session, constants.COMPANY_NAME, companyName);
        setExtraData(session, constants.COMPANY_NUMBER, companyNumber);
    });

    redirectPageSpy.mockReturnValue(false);

    it("should re-render page with errors when no option is selected in Welsh", async () => {
        // Given
        const request = router.post(`${url}?lang=cy`);

        // When
        const response = await request;

        // Then
        expect(response.status).toBe(200);
        expect(response.text).toContain(cy.you_must_select_an_option);
        expect(response.text).toContain(cyCommon.title_error);
    });

    it("should redirect to landing page when 'No' is selected", async () => {
        // Given
        const request = router.post(url).send({ confirmRemoval: "no" });

        // When
        const response = await request;

        // Then
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(constants.LANDING_URL);
    });

    it("should redirect to confirmation page when 'Yes' is selected", async () => {
        // Given
        (associationsService.isOrWasCompanyAssociatedWithUser as jest.Mock).mockResolvedValue({
            state: "COMPANY_ASSOCIATED_WITH_USER",
            associationId: "test-association-id"
        });

        (associationsService.removeUserFromCompanyAssociations as jest.Mock).mockResolvedValue(constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);

        const request = router.post(url).send({ confirmRemoval: "yes" });

        // When
        const response = await request;

        // Then
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(getFullUrl(constants.REMOVE_COMPANY_CONFIRMED_URL));
        expect(associationsService.isOrWasCompanyAssociatedWithUser).toHaveBeenCalledWith(
            expect.anything(),
            companyNumber
        );
    });

    it("should render error page if company is not associated with user", async () => {
        // Given
        (associationsService.isOrWasCompanyAssociatedWithUser as jest.Mock).mockResolvedValue({
            state: "COMPANY_NOT_ASSOCIATED_WITH_USER"
        });

        const request = router.post(url).send({ confirmRemoval: "yes" });

        // When
        const response = await request;

        // Then
        expect(response.status).toBe(200);
        expect(response.text).toContain("Error removing company");
    });

    it("should render error page if removal result is unexpected", async () => {
        // Given
        (associationsService.isOrWasCompanyAssociatedWithUser as jest.Mock).mockResolvedValue({
            state: "COMPANY_ASSOCIATED_WITH_USER",
            associationId: "test-association-id"
        });

        (associationsService.removeUserFromCompanyAssociations as jest.Mock).mockResolvedValue("UNEXPECTED_RESULT");

        const request = router.post(url).send({ confirmRemoval: "yes" });

        // When
        const response = await request;

        // Then
        expect(response.status).toBe(200);
        expect(response.text).toContain("Error removing company");
    });

    it("Should return expected English error message if option not selected and language version set to English", async () => {
        // Given
        const request = router.post(`${url}?lang=en`);

        // When
        const response = await request;

        // Then
        expect(response.text).toContain(en.you_must_select_an_option);
    });

    it("Should return expected Welsh error message if option not selected and language version set to Welsh", async () => {
        // Given
        const request = router.post(`${url}?lang=cy`);

        // When
        const response = await request;

        // Then
        expect(response.text).toContain(cy.you_must_select_an_option);
    });
});
