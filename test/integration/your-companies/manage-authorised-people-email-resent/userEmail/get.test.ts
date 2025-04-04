import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../src/constants";
import * as associationsService from "../../../../../src/services/associationsService";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";

const router = supertest(app);

jest.mock("../../../../../src/lib/Logger");
const createAssociationSpy: jest.SpyInstance = jest.spyOn(associationsService, "createAssociation");
const session: Session = new Session();
mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

describe("GET /your-companies/manage-authorised-people-email-resent/:userEmail", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.COMPANY_NUMBER, "1234567");
    });

    it("should call redirect to resent email success page when email is valid and is associated", async () => {
        // Given
        const url = "/your-companies/manage-authorised-people-email-resent/bob1@bob.com";
        const expectedRedirectUrl = "/your-companies/manage-authorised-people/1234567/authorisation-email-resent";
        createAssociationSpy.mockReturnValue({ association_id: "123456" });
        // When
        const response = await router.get(url);
        // Then
        expect(response.statusCode).toEqual(302);
        expect(response.header.location).toEqual(expectedRedirectUrl);
    });

    it("should reject invalid emails", async () => {
        // Given
        const url = "/your-companies/manage-authorised-people-email-resent/bob1bob.com";
        const expectedRedirectUrl = "/your-companies/something-went-wrong";

        // When
        const response = await router.get(url);

        // Then
        expect(response.statusCode).toEqual(302);
        expect(response.header.location).toEqual(expectedRedirectUrl);
    });

});
