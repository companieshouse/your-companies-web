import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../../locales/en/remove-company.json";
import cy from "../../../../../locales/cy/remove-company.json";
import enCommon from "../../../../../locales/en/common.json";
import cyCommon from "../../../../../locales/cy/common.json";
import { setExtraData, getExtraData } from "../../../../../src/lib/utils/sessionUtils";
import { getCompanyProfile } from "../../../../../src/services/companyProfileService";

const router = supertest(app);
const companyNumber = "123456";
const companyName = "TEST COMPANY LTD";
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

describe("GET /your-companies/remove-company/:companyNumber", () => {

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

    it("should check session and auth before returning the remove company page", async () => {
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        // Given
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and expected $langInfo content if language version set to '$langVersion'",
        async ({ langVersion, lang, langCommon }) => {
            // When
            const response = await router.get(`${url}${langVersion ? `?lang=${langVersion}` : ""}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.title_remove_company);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(lang.are_you_sure_you_want_to_remove_company);
            expect(response.text).toContain(langCommon.yes);
            expect(response.text).toContain(langCommon.no);
            expect(response.text).toContain(langCommon.continue);
            expect(getCompanyProfile).toHaveBeenCalledWith(companyNumber);
        });

    it("should return error in page content if error exists in session data", async () => {
        // Given
        setExtraData(session, constants.YOU_MUST_SELECT_AN_OPTION, en.you_must_select_an_option);
        (getCompanyProfile as jest.Mock).mockRejectedValue({ error: "Error" });
        // When
        const response = await router.get(`${url}?lang=en`);
        // Then
        expect(response.text).toContain(en.you_must_select_an_option);
    });

    it("should return correct response message to /your-companies for remove-company page redirection", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        mocks.mockNavigationMiddleware.mockImplementation((req: Request, res: Response) => {
            res.redirect(urlPath);
        });
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

});
