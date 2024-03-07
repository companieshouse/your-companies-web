import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { COMPANY_NAME } from "../../../../src/constants";
import * as en from "../../../../src/locales/en/translation/company-invitations-decline.json";
import * as cy from "../../../../src/locales/cy/translation/company-invitations-decline.json";

const router = supertest(app);
const session: Session = new Session();
const associationId = "123456";
const url = `/your-companies/company-invitations-decline/${associationId}`;

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

describe("GET /your-companies/companies-invitations-decline/:associationId", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the /your-companies/companies-invitations-decline/:associationId page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    // it("should return expected English content if language version set to English", async () => {
    //     // Given
    //     const langVersion = "&lang=en";
    //     const expectedCompanyName = "Doughnuts Limited";
    //     session.setExtraData(COMPANY_NAME, expectedCompanyName);
    //     // When
    //     const response = await router.get(`${url}${langVersion}`);
    //     // Then
    //     expect(response.text).toContain(en.invitation_declined);
    //     expect(response.text).toContain(`${en.you_have_declined_to_be_digitally_authorised}${expectedCompanyName}`);
    //     expect(response.text).toContain(en.what_happens_now_youve_declined);
    //     expect(response.text).toContain(en.weve_sent_an_email);
    //     expect(response.text).toContain(en.view_your_companies);
    // });

    // it("should return expected Welsh content if language version set to Welsh", async () => {
    //     // Given
    //     const langVersion = "&lang=cy";
    //     const expectedCompanyName = "Doughnuts Limited";
    //     session.setExtraData(COMPANY_NAME, expectedCompanyName);
    //     // When
    //     const response = await router.get(`${url}${langVersion}`);
    //     // Then
    //     expect(response.text).toContain(cy.invitation_declined);
    //     // expect(response.text).toContain(`${cy.you_have_declined_to_be_digitally_authorised}${expectedCompanyName}`);
    //     expect(response.text).toContain(cy.you_have_declined_to_be_digitally_authorised);
    //     expect(response.text).toContain(expectedCompanyName);
    //     expect(response.text).toContain(cy.what_happens_now_youve_declined);
    //     expect(response.text).toContain(cy.weve_sent_an_email);
    //     expect(response.text).toContain(cy.view_your_companies);
    // });
});
