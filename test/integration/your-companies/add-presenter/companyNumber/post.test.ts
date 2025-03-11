import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import en from "../../../../../locales/en/add-presenter.json";
import cy from "../../../../../locales/cy/add-presenter.json";
import * as constants from "../../../../../src/constants";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../../src/services/companyProfileService");

const router = supertest(app);
const url = "/your-companies/add-presenter/12345678";
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.headers = { referrer: "testUrl.com/confirmation-person-removed" };
    req.session = session;
    next();
});

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

describe("POST /your-companies/add-presenter/:companyNumber", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.COMPANY_NUMBER, "12345678");
        session.setExtraData(constants.COMPANY_NAME, "Test Company");
    });

    it("should check session, company and user auth before routing to controller", async () => {
        await router.post(url).send({ email: "" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        // Given
        {
            langInfo: "English",
            langVersion: "en",
            condition: "no email provided",
            email: "",
            errorMessage: en.errors_email_required
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            condition: "no email provided",
            email: "",
            errorMessage: cy.errors_email_required
        },
        {
            langInfo: "English",
            langVersion: "en",
            condition: "email invalid",
            email: "abc",
            errorMessage: en.errors_email_invalid
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            condition: "email invalid",
            email: "abc",
            errorMessage: cy.errors_email_invalid
        }
    ])("should display $langInfo version of the page with error message if $condition and language set to '$langVersion'",
        async ({ email, errorMessage, langVersion }) => {
            // When
            const response = await router.post(`${url}?lang=${langVersion}`).send({ email });
            // Then
            expect(response.text).toContain(errorMessage);
        });

    it("should redirect to the check presenter page if provided email is correct", async () => {
        // Given
        const email = "bob@bob.com";
        // When
        const response = await router.post(url).send({ email });
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual("/your-companies/add-presenter-check-details/12345678");
    });
});
