import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as associationsService from "../../../../../src/services/associationsService";
import * as constants from "../../../../../src/constants";
import * as referrerUtils from "../../../../../src/lib/utils/referrerUtils";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { getFullUrl } from "../../../../../src/lib/utils/urlUtils";

jest.mock("../../../../../src/lib/Logger");

jest.mock("../../../../../src/services/companyProfileService");
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

const mockPostInvitation = jest.spyOn(associationsService, "postInvitation");

const router = supertest(app);
const url = "/your-companies/add-presenter-check-details/12345678";

const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
redirectPageSpy.mockReturnValue(false);

describe("POST /your-companies/add-presenter-check-details/:companyNumber", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.COMPANY_NUMBER, "12345678");
        session.setExtraData(constants.COMPANY_NAME, "Test Company");
        redirectPageSpy.mockReturnValue(false);
    });

    it("should check session, company and user auth before routing to controller", async () => {
        await router.post(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect to the manage authorised person added success page", async () => {
        // Given
        const email = "bruce@bruce.com";
        session.data.extra_data.authorisedPersonEmail = email;
        const associationId = "12345678";
        mockPostInvitation.mockResolvedValue(associationId);
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toContain(getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL).replace(
            `:${constants.COMPANY_NUMBER}`, "12345678"
        ));
    });
});
