import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../../../src/constants";
import { SendEmailToBeDigitallyAuthorisedHandler } from "../../../../../../src/routers/handlers/yourCompanies/sendEmailToBeDigitallyAuthorisedHandler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { companyAssociations } from "../../../../../mocks/associations.mock";
import * as associationsService from "../../../../../../src/services/associationsService";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getManageAuthorisedPeopleFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getManageAuthorisedPeopleFullUrl");
const getAssociationByIdSpy: jest.SpyInstance = jest.spyOn(associationsService, "getAssociationById");

describe("SendEmailToBeDigitallyAuthorisedHandler", () => {
    let sendEmailToBeDigitallyAuthorisedHandler: SendEmailToBeDigitallyAuthorisedHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        sendEmailToBeDigitallyAuthorisedHandler = new SendEmailToBeDigitallyAuthorisedHandler();
    });

    test.each([
        {
            method: constants.GET,
            viewData: {},
            association: companyAssociations.items[0],
            return: "view data",
            condition: ""
        }
    ])("should return $return when method is $method $condition",
        async ({ association, method, viewData }) => {
            // Given
            const lang = "en";
            const associationId = association.id;
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                params: { associationId },
                lang
            });
            const translations = { key: "value", not_provided: "Not provided" };
            getTranslationsForViewSpy.mockReturnValue(translations);
            const companyName = association.companyName;
            const companyNumber = association.companyNumber;
            const userEmail = association.userEmail;
            getExtraDataSpy
                .mockReturnValueOnce(companyNumber)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(companyName)
                .mockReturnValueOnce(association);
            const associationIdKey = `${constants.ASSOCIATIONS_ID}_${associationId}`;
            const manageAuthorisedPeopleFullUrl = `/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;
            getManageAuthorisedPeopleFullUrlSpy.mockReturnValue(manageAuthorisedPeopleFullUrl);
            const getExtraDataKeys = [
                constants.COMPANY_NAME,
                constants.SEARCH_STRING_EMAIL,
                constants.COMPANY_NUMBER,
                associationIdKey
            ];
            const expectedViewData = {
                templateName: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_PAGE,
                cancelLinkHref: manageAuthorisedPeopleFullUrl,
                backLinkHref: manageAuthorisedPeopleFullUrl,
                lang: translations,
                companyName,
                companyNumber,
                userEmail,
                userDisplayName: translations.not_provided,
                ...viewData
            };
            // When
            const response = await sendEmailToBeDigitallyAuthorisedHandler.execute(req, method);
            // Then
            expect(getExtraDataSpy).toHaveBeenCalledTimes(getExtraDataKeys.length);
            for (const key of getExtraDataKeys) {
                expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), key);
            }
            expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
            expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_PAGE);
            expect(response).toEqual(expectedViewData);
        });

    it("should return fetch association when its not found in session", async () => {
        // Given
        const associationId = "123456789";
        const req: Request = mockParametrisedRequest({
            session: new Session(),
            params: { associationId }
        });
        const translations = { key: "value", not_provided: "Not provided" };
        getTranslationsForViewSpy.mockReturnValue(translations);

        getExtraDataSpy
            .mockReturnValueOnce("companyNumber")
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce("companyName")
            .mockReturnValueOnce(undefined);

        getAssociationByIdSpy.mockResolvedValueOnce(companyAssociations.items[0]);

        // When
        const response = await sendEmailToBeDigitallyAuthorisedHandler.execute(req, constants.GET);
        // Then
        expect(response).toEqual({
            backLinkHref: undefined,
            cancelLinkHref: undefined,
            companyName: "COMPANYNAME",
            companyNumber: "companyNumber",
            lang: {
                key: "value",
                not_provided: "Not provided"
            },
            templateName: "send-email-invitation-to-be-digitally-authorised",
            userDisplayName: "Not provided",
            userEmail: "demo@ch.gov.uk"
        });
    });
});
