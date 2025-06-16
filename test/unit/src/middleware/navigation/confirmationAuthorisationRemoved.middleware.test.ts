import { mockParametrisedRequest, mockRequest } from "../../../../mocks/request.mock";
import { NextFunction, Request, Response } from "express";
import * as constants from "../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { confirmationAuthorisationRemovedNavigation } from "../../../../../src/middleware/navigation/confirmationAuthorisationRemoved.middleware";
import { mockResponse } from "../../../../mocks/response.mock";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as referrerUtils from "../../../../../src/lib/utils/referrerUtils";

const req: Request = mockRequest();
req.session = new Session();
const res = mockResponse();
const next: NextFunction = jest.fn();

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
describe("confirmationAuthorisationRemovedNavigation", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        req.headers = {
            referrer: constants.LANDING_URL
        };
    });

    it("should redirect to your companies landing page", async () => {
        // Given
        const companyNumber = "FL123456";
        const referrer = constants.LANDING_URL;
        const removeAuthorisationDoNotRestoreUrl = `/${constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE}/${companyNumber}`;
        getExtraDataSpy.mockReturnValueOnce(removeAuthorisationDoNotRestoreUrl);
        redirectPageSpy.mockReturnValueOnce(true);

        const req: Request = mockParametrisedRequest({
            session: new Session()
        });

        req.get = jest.fn().mockImplementation(() => {
            return referrer;
        });

        // When
        await confirmationAuthorisationRemovedNavigation(req as Request, res as Response, next as NextFunction);
        // Then
        expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledWith(req.session, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL_EXTRA);

        expect(redirectPageSpy).toHaveBeenCalledTimes(1);
        expect(redirectPageSpy).toHaveBeenCalledWith(referrer, removeAuthorisationDoNotRestoreUrl, constants.CONFIRMATION_AUTHORISATION_REMOVED_URL, false);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith(constants.LANDING_URL);
    });

});
