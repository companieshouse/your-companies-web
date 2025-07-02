import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../../locales/en/remove-authorisation-do-not-restore.json";
import cy from "../../../../../locales/cy/remove-authorisation-do-not-restore.json";
import enCommon from "../../../../../locales/en/common.json";
import cyCommon from "../../../../../locales/cy/common.json";
import { setExtraData, getExtraData } from "../../../../../src/lib/utils/sessionUtils";
import { getCompanyProfile } from "../../../../../src/services/companyProfileService";

const router = supertest(app);
const companyNumber = "123456";
const companyName = "Test Company Ltd";
const url = `/your-companies/remove-authorisation-do-not-restore/${companyNumber}`;
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

describe("GET /your-companies/remove-authorisation-do-not-restore/:companyNumber", () => {

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
        async ({ langVersion, lang }) => {
            // When
            const response = await router.get(`${url}${langVersion ? `?lang=${langVersion}` : ""}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.are_you_sure_you_want_to);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(lang.if_you_remove_the_company);
            expect(response.text).toContain(lang.remove_company);
        });

    it("should return status 302 and correct response message including desired url path on page redirect", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        mocks.mockNavigationMiddleware.mockImplementation((req: Request, res: Response) => {
            res.redirect(urlPath);
        });
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
