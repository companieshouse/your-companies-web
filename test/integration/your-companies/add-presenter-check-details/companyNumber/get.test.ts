import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import en from "../../../../../locales/en/add-presenter-check-details.json";
import cy from "../../../../../locales/cy/add-presenter-check-details.json";

jest.mock("../../../../../src/lib/Logger");

jest.mock("../../../../../src/services/companyProfileService");
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

const router = supertest(app);
const url = "/your-companies/add-presenter-check-details/12345678";

describe("GET /your-companies/add-presenter-check-details/:companyNumber", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.COMPANY_NUMBER, "NI038379");
        session.setExtraData(constants.COMPANY_NAME, "Test Company");
    });

    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        // Given
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return status 200 and expected $langInfo content if lang set to '$langVersion'",
       async ({ langVersion, lang }) => {
           // When
           const response = await router.get(`${url}?lang=${langVersion}`);
           // Then
           expect(response.status).toEqual(200);
           expect(response.text).toContain(lang.email_address);
           expect(response.text).toContain(lang.change);
           expect(response.text).toContain(lang.confirm_and_send_email);
           expect(response.text).toContain(lang.change);
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
