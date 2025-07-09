import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../locales/en/confirmation-authorisation-removed.json";
import cy from "../../../../locales/cy/confirmation-authorisation-removed.json";
import enCommon from "../../../../locales/en/common.json";
import cyCommon from "../../../../locales/cy/common.json";
import { setExtraData, getExtraData } from "../../../../src/lib/utils/sessionUtils";
import { getCompanyProfile } from "../../../../src/services/companyProfileService";

const router = supertest(app);
const companyNumber = "123456";
const companyName = "Test Company Ltd";
const url = `/your-companies/confirmation-authorisation-removed`;
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

describe("GET /your-companies/confirmation-authorisation-removed", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        (setExtraData as jest.Mock).mockImplementation((session, key, value) => {
            session.data[key] = value;
        });
        (getExtraData as jest.Mock).mockImplementation((session, key) => session.data[key]);
        setExtraData(session, constants.REMOVE_AUTHORISATION_COMPANY_NAME, companyName);
        setExtraData(session, constants.REMOVE_AUTHORISATION_COMPANY_NUMBER, companyNumber);

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
            expect(response.text).toContain(lang.company_removed);
            expect(response.text).toContain(lang.you_have_confirmed);
            expect(response.text).toContain(companyName);
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(lang.what_happens_now);
            expect(response.text).toContain(lang.you_are_no_longer_able_to_file);
            expect(response.text).toContain(lang.weve_sent_an_email);
            expect(response.text).toContain(lang.go_to_your_companies);
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
