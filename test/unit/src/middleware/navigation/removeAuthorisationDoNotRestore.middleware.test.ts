import { mockParametrisedRequest, mockRequest } from "../../../../mocks/request.mock";
import { NextFunction, Request, Response } from "express";
import * as constants from "../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { removeAuthorisationDoNotRestoreNavigation } from "../../../../../src/middleware/navigation/removeAuthorisationDoNotRestore.middleware";
import { mockResponse } from "../../../../mocks/response.mock";
import * as urlUtils from "../../../../../src/lib/utils/urlUtils";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as referrerUtils from "../../../../../src/lib/utils/referrerUtils";

const req: Request = mockRequest();
req.session = new Session();
const res = mockResponse();
const next: NextFunction = jest.fn();

const getRemoveAuthorisationDoNotRestoreUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getRemoveAuthorisationDoNotRestoreUrl");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
describe("removeAuthorisationDoNotRestoreNavigation", () => {

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
        getRemoveAuthorisationDoNotRestoreUrlSpy.mockReturnValueOnce(removeAuthorisationDoNotRestoreUrl);
        redirectPageSpy.mockReturnValueOnce(true);

        const req: Request = mockParametrisedRequest({
            session: new Session(),
            params: {
                companyNumber
            }
        });

        req.get = jest.fn().mockImplementation(() => {
            return referrer;
        });

        // When
        await removeAuthorisationDoNotRestoreNavigation(req as Request, res as Response, next as NextFunction);
        // Then
        expect(getRemoveAuthorisationDoNotRestoreUrlSpy).toHaveBeenCalledTimes(1);
        expect(getRemoveAuthorisationDoNotRestoreUrlSpy).toHaveBeenCalledWith(companyNumber);

        expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL_EXTRA, removeAuthorisationDoNotRestoreUrl);

        expect(redirectPageSpy).toHaveBeenCalledTimes(1);
        expect(redirectPageSpy).toHaveBeenCalledWith(referrer, constants.LANDING_URL, removeAuthorisationDoNotRestoreUrl, false);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith(constants.LANDING_URL);
    });

});
