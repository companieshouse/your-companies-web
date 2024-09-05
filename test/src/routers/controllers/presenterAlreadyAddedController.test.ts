import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/constants";
import * as en from "../../../../locales/en/presenter-already-added.json";
import * as cy from "../../../../locales/cy/presenter-already-added.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import { when } from "jest-when";

const router = supertest(app);

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        getExtraData: jest.fn()
    };
});

describe("GET /your-companies/presenter-already-added/{:companyNumber}", () => {
    const companyNumber = "AB123456";
    const companyName = "ABC Ltd.";
    const userEmail = "john.smith@test.com";
    const url = `/your-companies/presenter-already-added/${companyNumber}`;
    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

    beforeEach(() => {
        jest.clearAllMocks();
        redirectPageSpy.mockReturnValue(false);
    });

    it("should check session, auth and company authorisation before returning the your-companies page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return status 302", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
    });

    it("should return expected English content if language version set to English", async () => {
        // Given
        const langVersion = "?lang=en";
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.COMPANY_NUMBER).mockReturnValue(companyNumber);
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.COMPANY_NAME).mockReturnValue(companyName);
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.AUTHORISED_PERSON_EMAIL).mockReturnValue(userEmail);
        const expectedCaption = `${companyName} (${companyNumber})`;
        // When
        const response = await router.get(`${url}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedCaption);
        expect(response.text).toContain(en.this_person_is_already_authorised);
        expect(response.text).toContain(en.the_person_with_the_email_address);
        expect(response.text).toContain(userEmail);
        expect(response.text).toContain(en.has_already_been_digitally_authorised);
        expect(response.text).toContain(enCommon.go_back_to_your_companies);
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        // Given
        const langVersion = "?lang=cy";
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.COMPANY_NUMBER).mockReturnValue(companyNumber);
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.COMPANY_NAME).mockReturnValue(companyName);
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.AUTHORISED_PERSON_EMAIL).mockReturnValue(userEmail);
        const expectedCaption = `${companyName} (${companyNumber})`;
        // When
        const response = await router.get(`${url}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedCaption);
        expect(response.text).toContain(cy.this_person_is_already_authorised);
        expect(response.text).toContain(cy.the_person_with_the_email_address);
        expect(response.text).toContain(userEmail);
        expect(response.text).toContain(cy.has_already_been_digitally_authorised);
        expect(response.text).toContain(cyCommon.go_back_to_your_companies);
    });
});
