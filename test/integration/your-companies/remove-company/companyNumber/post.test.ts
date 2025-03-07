import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import * as en from "../../../../../locales/en/remove-company.json";
import * as cy from "../../../../../locales/cy/remove-company.json";
import * as enCommon from "../../../../../locales/en/common.json";
import * as cyCommon from "../../../../../locales/cy/common.json";
import * as referrerUtils from "../../../../../src/lib/utils/referrerUtils";
import { setExtraData, getExtraData } from "../../../../../src/lib/utils/sessionUtils";
import * as associationsService from "../../../../../src/services/associationsService";
import { getFullUrl } from "../../../../../src/lib/utils/urlUtils";

const router = supertest(app);
const companyNumber = "123456";
const companyName = "Test Company Ltd";
const url = `/your-companies/remove-company/${companyNumber}`;
const session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/lib/utils/sessionUtils", () => ({
    ...jest.requireActual("../../../../../src/lib/utils/sessionUtils"),
    setExtraData: jest.fn(),
    getExtraData: jest.fn()
}));

jest.mock("../../../../../src/services/companyProfileService");

jest.mock("../../../../../src/services/associationsService", () => ({
    ...jest.requireActual("../../../../../src/services/associationsService"),
    isOrWasCompanyAssociatedWithUser: jest.fn(),
    removeUserFromCompanyAssociations: jest.fn()
}));

const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

describe("POST /your-companies/remove-company/:companyNumber", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        (setExtraData as jest.Mock).mockImplementation((session, key, value) => {
            session.data[key] = value;
        });
        (getExtraData as jest.Mock).mockImplementation((session, key) => session.data[key]);
        setExtraData(session, constants.COMPANY_NAME, companyName);
        setExtraData(session, constants.COMPANY_NUMBER, companyNumber);
        redirectPageSpy.mockReturnValue(false);
    });

    test.each([
        // Given
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should re-render page with errors in $langInfo when no option is selected and lang set to '$langVersion'",
        async ({ langVersion, lang, langCommon }) => {
            // When
            const response = await router.post(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toBe(200);
            expect(response.text).toContain(lang.you_must_select_an_option);
            expect(response.text).toContain(langCommon.title_error);
        });

    it("should redirect to landing page when 'No' is selected", async () => {
        // Given
        const confirmRemoval = "no";
        // When
        const response = await router.post(url).send({ confirmRemoval });
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
        const confirmRemoval = "yes";
        // When
        const response = await router.post(url).send({ confirmRemoval });
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
});
