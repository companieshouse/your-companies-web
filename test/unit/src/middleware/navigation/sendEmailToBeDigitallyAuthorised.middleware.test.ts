import { sendEmailToBeDigitallyAuthorisedNavigation } from "../../../../../src/middleware/navigation/sendEmailToBeDigitallyAuthorised.middleware";
import * as constants from "../../../../../src/constants";
import * as referrerUtils from "../../../../../src/lib/utils/referrerUtils";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { Request, Response, NextFunction } from "express";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../../src/lib/utils/referrerUtils");
jest.mock("../../../../../src/lib/utils/urlUtils");
jest.mock("../../../../../src/lib/utils/sessionUtils");

describe("sendEmailToBeDigitallyAuthorisedNavigation middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    const mockCompanyNumber = "12345678";
    const mockAssociationId = "assoc-1";
    const mockManagePeopleUrl = "/manage-people";
    const mockSendEmailUrl = "/send-email";
    const mockReferrer = "http://referrer";

    beforeEach(() => {
        req = {
            get: jest.fn().mockImplementation((header) => header === "Referrer" ? mockReferrer : undefined),
            params: { associationId: mockAssociationId },
            session: {} as Session
        };
        res = {
            redirect: jest.fn()
        };
        next = jest.fn();

        (sessionUtils.getExtraData as jest.Mock).mockReturnValue(mockCompanyNumber);
        (urlUtils.getManageAuthorisedPeopleFullUrl as jest.Mock).mockReturnValue(mockManagePeopleUrl);
        (urlUtils.getSendEmailToBeDigitallyAuthorisedFullUrl as jest.Mock).mockReturnValue(mockSendEmailUrl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should redirect to LANDING_URL if redirectPage returns true", async () => {
        // Given
        (referrerUtils.redirectPage as jest.Mock).mockReturnValue(true);
        // When
        await sendEmailToBeDigitallyAuthorisedNavigation(
            req as Request,
            res as Response,
            next
        );
        // Then
        expect(referrerUtils.redirectPage).toHaveBeenCalledWith(
            mockReferrer,
            mockManagePeopleUrl,
            mockSendEmailUrl,
            false
        );
        expect(sessionUtils.getExtraData).toHaveBeenCalledWith(req.session, constants.COMPANY_NUMBER);
        expect(urlUtils.getSendEmailToBeDigitallyAuthorisedFullUrl).toHaveBeenCalledWith(mockAssociationId);
        expect(res.redirect).toHaveBeenCalledWith(constants.LANDING_URL);
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if redirectPage returns false", async () => {
        // Given
        (referrerUtils.redirectPage as jest.Mock).mockReturnValue(false);
        // When
        await sendEmailToBeDigitallyAuthorisedNavigation(
            req as Request,
            res as Response,
            next
        );
        // Then
        expect(referrerUtils.redirectPage).toHaveBeenCalledWith(
            mockReferrer,
            mockManagePeopleUrl,
            mockSendEmailUrl,
            false
        );
        expect(sessionUtils.getExtraData).toHaveBeenCalledWith(req.session, constants.COMPANY_NUMBER);
        expect(urlUtils.getSendEmailToBeDigitallyAuthorisedFullUrl).toHaveBeenCalledWith(mockAssociationId);
        expect(res.redirect).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it("should redirect to LANDING_URL if missing Referrer header", async () => {
        // Given
        req.get = jest.fn().mockReturnValue(undefined);
        (referrerUtils.redirectPage as jest.Mock).mockReturnValue(true);
        // When
        await sendEmailToBeDigitallyAuthorisedNavigation(
            req as Request,
            res as Response,
            next
        );
        // Then
        expect(referrerUtils.redirectPage).toHaveBeenCalledWith(
            undefined,
            mockManagePeopleUrl,
            mockSendEmailUrl,
            false
        );
        expect(res.redirect).toHaveBeenCalledWith(constants.LANDING_URL);
        expect(next).not.toHaveBeenCalled();
    });
});
