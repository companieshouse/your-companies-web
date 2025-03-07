import mocks from "../../../../../mocks/all.middleware.mock";
import { companyAssociations } from "../../../../../mocks/associations.mock";
import app from "../../../../../../src/app";
import * as associationsService from "../../../../../../src/services/associationsService";
import supertest from "supertest";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import { Cancellation } from "../../../../../../src/types/cancellation";
import * as constants from "../../../../../../src/constants";
import * as referrerUtils from "../../../../../../src/lib/utils/referrerUtils";
import * as en from "../../../../../../locales/en/manage-authorised-people.json";
import * as cy from "../../../../../../locales/cy/manage-authorised-people.json";
import * as enCommon from "../../../../../../locales/en/common.json";
import * as cyCommon from "../../../../../../locales/cy/common.json";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { when } from "jest-when";
import { Association } from "private-api-sdk-node/dist/services/associations/types";
import { AssociationState, AssociationStateResponse } from "../../../../../../src/types/associations";

const router = supertest(app);

jest.mock("../../../../../../src/lib/Logger");
jest.mock("../../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        getExtraData: jest.fn()
    };
});

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

const companyNumber = "NI038379";
const url = `/your-companies/manage-authorised-people/${companyNumber}/confirmation-cancel-person`;
const getCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getCompanyAssociations");
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
const isAssociated: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "" };
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const cancellation: Cancellation = {
    cancelPerson: constants.YES,
    userEmail: companyAssociations.items[0].userEmail,
    companyNumber: companyAssociations.items[0].companyNumber
};
const expectedCompanyAssociations = Object.assign({}, companyAssociations);
expectedCompanyAssociations.items = companyAssociations.items.filter((item: Association) => item.userEmail !== cancellation.userEmail);

describe("GET /your-companies/manage-authorised-people/:companyNumber/confirmation-cancel-person", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
        redirectPageSpy.mockReturnValue(false);
        when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.CANCEL_PERSON).mockReturnValue(cancellation);
        removeUserFromCompanyAssociationsSpy.mockReturnValue(constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
    });

    it("should check session and auth before returning the /your-companies/manage-authorised-people/NI038379 page", async () => {
        getCompanyAssociationsSpy.mockReturnValue(companyAssociations);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "person cancelled",
            companyAssociations1: companyAssociations,
            companyAssociations2: companyAssociations,
            companyAssociations3: expectedCompanyAssociations,
            userRemovedFromCompanyAssociations: undefined
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "person cancelled",
            companyAssociations1: companyAssociations,
            companyAssociations2: companyAssociations,
            companyAssociations3: expectedCompanyAssociations,
            userRemovedFromCompanyAssociations: undefined
        },
        {
            langInfo: "English",
            langVersion: "en",
            lang: en,
            langCommon: enCommon,
            condition: "person already cancelled",
            companyAssociations1: expectedCompanyAssociations,
            companyAssociations2: expectedCompanyAssociations,
            companyAssociations3: expectedCompanyAssociations,
            userRemovedFromCompanyAssociations: constants.TRUE
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            lang: cy,
            langCommon: cyCommon,
            condition: "person already cancelled",
            companyAssociations1: expectedCompanyAssociations,
            companyAssociations2: expectedCompanyAssociations,
            companyAssociations3: expectedCompanyAssociations,
            userRemovedFromCompanyAssociations: constants.TRUE
        }
    ])("should return expected $langInfo content if $condition and language version set to $langVersion",
        async ({ lang, langCommon, langVersion, companyAssociations1, companyAssociations2, companyAssociations3 }) => {
            // Given
            getCompanyAssociationsSpy.mockReturnValueOnce(companyAssociations1).mockReturnValueOnce(companyAssociations2).mockReturnValueOnce(companyAssociations3);
            when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS).mockReturnValue(undefined);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(langCommon.success);
            expect(response.text).toContain(lang.digital_authorisation_cancelled);
            expect(response.text).toContain(lang.you_have_successfully_cancelled_digital_authorisation_start);
            expect(response.text).toContain(lang.you_have_successfully_cancelled_digital_authorisation_end);
            expect(response.text).toContain(lang.weve_sent_an_email_to_the_company);
            expect(response.text).toContain(`${companyAssociations.items[0].companyName} (${companyAssociations.items[0].companyNumber})`);
            expect(response.text).toContain(lang.people_digitally_authorised_to_file_online);
            expect(response.text).toContain(lang.anyone_with_access_to_the_current_authentication);
            expect(response.text).toContain(lang.add_new_authorised_person);
            expect(response.text).toContain(lang.details_of_authorised_people);
            expect(response.text).toContain(lang.email_address);
            expect(response.text).toContain(lang.name);
            expect(response.text).toContain(lang.status);
            expect(response.text).toContain(lang.remove);
            expect(response.text).toContain(langCommon.back_to_your_companies);
            expect(response.text).not.toContain(companyAssociations.items[0].userEmail + "</th>");
            expect(response.text).toContain(companyAssociations.items[1].userEmail + "</th>");
            expect(response.text).toContain(companyAssociations.items[2].userEmail + "</th>");
            expect(response.text).toContain(companyAssociations.items[3].userEmail + "</th>");
        });

    it("should return status 302 on page redirect", async () => {
        // Given
        redirectPageSpy.mockReturnValue(true);
        sessionUtils.setExtraData(session, constants.CANCEL_URL_EXTRA, "test.com");
        // When
        const response = await router.get(url);
        // Then
        const cancelUrlExtraData = session.getExtraData(constants.CANCEL_URL_EXTRA);
        expect(cancelUrlExtraData).toBeUndefined();
        expect(response.status).toEqual(302);

    });

    it("should return correct response message including desired url path", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
