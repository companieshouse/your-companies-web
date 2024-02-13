import mocks from "../../../mocks/all.middleware.mock";
import { companyAssociations, emptyAssociations } from "../../../mocks/associations.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { COMPANY_NAME } from "../../../../src/constants";

const router = supertest(app);
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn()
    };
});

describe("GET /your-companies/cancel-person/:userEmail", () => {
    const userEmail = "test@test.com";
    const url = `/your-companies/cancel-person/${userEmail}`;
    const en = require("../../../../src/locales/en/translation/cancel-person.json");
    const cy = require("../../../../src/locales/cy/translation/cancel-person.json");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the /your-companies/cancel-person/:userEmail page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if language version set to English", async () => {
        // Given
        const langVersion = "?lang=en";
        const expectedHeader = `${en.are_you_sure_you_want_to_cancel_start}${userEmail}${en.are_you_sure_you_want_to_cancel_end}`;
        const expectedCompanyName = "Doughnuts Limited";
        session.setExtraData(COMPANY_NAME, expectedCompanyName);
        // When
        const response = await router.get(`${url}${langVersion}`);
        // Then
        expect(response.text).toContain(expectedHeader);
        expect(response.text).toContain(expectedCompanyName);
    });
});
