import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../../../src/constants";
import { CompanyInvitationsAcceptHandler } from "../../../../../../src/routers/handlers/yourCompanies/companyInvitationsAcceptHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { AssociationStatus } from "@companieshouse/api-sdk-node/dist/services/associations/types";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const updateAssociationStatusSpy: jest.SpyInstance = jest.spyOn(associationsService, "updateAssociationStatus");
const getCompanyInvitationsAcceptFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getCompanyInvitationsAcceptFullUrl");
const mockGet = jest.fn();

describe("CompanyInvitationsAcceptHandler", () => {
    let companyInvitationsAcceptHandler: CompanyInvitationsAcceptHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        companyInvitationsAcceptHandler = new CompanyInvitationsAcceptHandler();
    });

    test.each([
        {
            associationStateChanged: constants.TRUE,
            referer: `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/1234567890?${constants.COMPANY_NAME}=${encodeURIComponent("Test+Ltd")}`,
            return: "with associationStateChanged undefined",
            condition: "assiciation state is changed",
            translations: { key: "value" }
        },
        {
            associationStateChanged: constants.TRUE,
            viewData: { associationStateChanged: constants.ASSOCIATION_STATE_CHANGED_FOR + "1234567890" },
            referer: `${constants.LANDING_URL}/`,
            return: `with associationStateChanged property set to ${constants.ASSOCIATION_STATE_CHANGED_FOR}1234567890`,
            condition: "assiciation state is changed and referrer does not include expected href",
            translations: {}
        },
        {
            associationStateChanged: undefined,
            viewData: {},
            referer: `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/1234567890?${constants.COMPANY_NAME}=${encodeURIComponent("Test+Ltd")}`,
            return: "with associationStateChanged undefined",
            condition: "assiciation state is not changed",
            translations: { key: "value" }
        }
    ])("should return view data $return if $condition",
        async ({ associationStateChanged, viewData, referer, translations }) => {
            // Given
            const lang = "en";
            const associationId = "1234567890";
            const companyName = "TEST LTD";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: { associationId },
                query: { companyName },
                get: mockGet
            });
            getTranslationsForViewSpy.mockReturnValue(translations);
            const url = `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/${associationId}`;
            getCompanyInvitationsAcceptFullUrlSpy.mockReturnValue(url);
            getExtraDataSpy.mockReturnValue(associationStateChanged);
            mockGet.mockReturnValue(referer);
            const expectedViewData = {
                templateName: constants.COMPANY_INVITATIONS_ACCEPT_PAGE,
                yourCompaniesUrl: constants.LANDING_URL,
                lang: translations,
                companyName,
                ...viewData
            };
            // When
            const response = await companyInvitationsAcceptHandler.execute(req);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
            expect(getExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.ASSOCIATION_STATE_CHANGED_FOR + associationId);
            if (Object.keys(translations).length > 0) {
                expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
                expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.COMPANY_INVITATIONS_ACCEPT_PAGE);
            }
            expect(getCompanyInvitationsAcceptFullUrlSpy).toHaveBeenCalledTimes(1);
            expect(getCompanyInvitationsAcceptFullUrlSpy).toHaveBeenCalledWith(associationId);
            if (!associationStateChanged) {
                expect(updateAssociationStatusSpy).toHaveBeenCalledTimes(1);
                expect(updateAssociationStatusSpy).toHaveBeenCalledWith(expect.anything(), associationId, AssociationStatus.CONFIRMED);
                expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
                expect(setExtraDataSpy).toHaveBeenCalledWith(expect.anything(), constants.ASSOCIATION_STATE_CHANGED_FOR + associationId, constants.TRUE);
            }
            expect(response).toEqual(expectedViewData);
        });
});
