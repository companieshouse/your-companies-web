import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../../src/constants";
import { RemoveAuthorisedPersonHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeAuthorisedPersonHandler";
import { Session } from "@companieshouse/node-session-handler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import * as associationsService from "../../../../../../src/services/associationsService";
import {
    singleAwaitingApprovalAssociation,
    singleConfirmedAssociation,
    singleMigratedAssociation,
    singleRemovedAssociation
} from "../../../../../mocks/associations.mock";
import { mockResponse } from "../../../../../mocks/response.mock";
import { AssociationStatus } from "@companieshouse/api-sdk-node/dist/services/associations/types";

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
const getAssociationByIdSpy: jest.SpyInstance = jest.spyOn(associationsService, "getAssociationById");
const getLoggedInUserIdSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserId");

describe("RemoveAuthorisedPersonHandler", () => {
    let removeAuthorisedPersonHandler: RemoveAuthorisedPersonHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        removeAuthorisedPersonHandler = new RemoveAuthorisedPersonHandler();
    });

    describe("RemoveAuthorisedPersonHandler - execute", () => {
        it("should return view data with templateName remove-authorised-person when confirmed association fetched from api", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";

            const associationId = "1234567890";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                }
            });

            getExtraDataSpy
                .mockReturnValueOnce(undefined);

            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValueOnce(translations);
            const expectedViewData = {
                templateName: constants.REMOVE_AUTHORISED_PERSON_PAGE,
                backLinkHref: "/your-companies/manage-authorised-people/NI038379",
                lang: translations,
                companyName: singleConfirmedAssociation.companyName,
                companyNumber: singleConfirmedAssociation.companyNumber,
                userEmail: singleConfirmedAssociation.userEmail,
                cancelLinkHref: "/your-companies/manage-authorised-people/NI038379",
                currentStatus: singleConfirmedAssociation.status,
                userName: singleConfirmedAssociation.userEmail
            };
            getAssociationByIdSpy.mockResolvedValueOnce(singleConfirmedAssociation);
            // When
            const viewData = await removeAuthorisedPersonHandler.execute(req);
            // Then
            expect(viewData).toEqual(expectedViewData);
        });

        it("should return view data with templateName cancel-person when awaiting-approval association found in session", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";

            const associationId = "1234567890";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                }
            });

            getExtraDataSpy
                .mockReturnValueOnce(singleAwaitingApprovalAssociation);

            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValueOnce(translations);
            const expectedViewData = {
                templateName: "cancel-person",
                backLinkHref: "/your-companies/manage-authorised-people/NI038379",
                lang: translations,
                companyName: singleAwaitingApprovalAssociation.companyName,
                companyNumber: singleAwaitingApprovalAssociation.companyNumber,
                userEmail: singleAwaitingApprovalAssociation.userEmail,
                cancelLinkHref: "/your-companies/manage-authorised-people/NI038379",
                currentStatus: singleAwaitingApprovalAssociation.status,
                userName: singleAwaitingApprovalAssociation.userEmail
            };
            // When
            const viewData = await removeAuthorisedPersonHandler.execute(req);
            // Then
            expect(viewData).toEqual(expectedViewData);
            expect(getAssociationByIdSpy).not.toHaveBeenCalled();
        });

        it("should return view data with templateName remove-do-not-restore when migrated association found in session", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";

            const associationId = "1234567890";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                }
            });

            getExtraDataSpy
                .mockReturnValueOnce(singleMigratedAssociation);

            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValueOnce(translations);
            const expectedViewData = {
                templateName: "remove-do-not-restore",
                backLinkHref: "/your-companies/manage-authorised-people/NI038379",
                lang: translations,
                companyName: singleMigratedAssociation.companyName,
                companyNumber: singleMigratedAssociation.companyNumber,
                userEmail: singleMigratedAssociation.userEmail,
                cancelLinkHref: "/your-companies/manage-authorised-people/NI038379",
                currentStatus: singleMigratedAssociation.status,
                userName: singleMigratedAssociation.userEmail
            };
            // When
            const viewData = await removeAuthorisedPersonHandler.execute(req);
            // Then
            expect(viewData).toEqual(expectedViewData);
            expect(getAssociationByIdSpy).not.toHaveBeenCalled();
        });

        it("should add errors property to view data if one exists in session", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";

            const associationId = "1234567890";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                }
            });

            getExtraDataSpy
                .mockReturnValueOnce(singleAwaitingApprovalAssociation)
                .mockReturnValueOnce({ confirmRemoval: { text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION } });

            const translations = { key: "value" };
            getTranslationsForViewSpy.mockReturnValueOnce(translations);
            const expectedViewData = {
                templateName: "cancel-person",
                backLinkHref: "/your-companies/manage-authorised-people/NI038379",
                lang: translations,
                companyName: singleAwaitingApprovalAssociation.companyName,
                companyNumber: singleAwaitingApprovalAssociation.companyNumber,
                userEmail: singleAwaitingApprovalAssociation.userEmail,
                cancelLinkHref: "/your-companies/manage-authorised-people/NI038379",
                currentStatus: singleAwaitingApprovalAssociation.status,
                userName: singleAwaitingApprovalAssociation.userEmail,
                errors: { confirmRemoval: { text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION } }
            };
            const viewData = await removeAuthorisedPersonHandler.execute(req);
            expect(viewData).toEqual(expectedViewData);

        });

        it("should error when association neither found in session and not successfully fetched", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";

            const associationId = "1234567890";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                }
            });

            getExtraDataSpy
                .mockReturnValueOnce(undefined);

            getAssociationByIdSpy.mockResolvedValueOnce(undefined);

            await expect(removeAuthorisedPersonHandler.execute(req))
                .rejects.toThrow(`Association to be removed not fetched from session or API`);

        });

        it("should error when company number in url does not match association company number", async () => {
            // Given
            const lang = "en";
            const companyNumber = "mismatchCompanyNumber";

            const associationId = "1234567890";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                }
            });

            getExtraDataSpy
                .mockReturnValueOnce(singleAwaitingApprovalAssociation);

            getAssociationByIdSpy.mockResolvedValueOnce(undefined);

            await expect(removeAuthorisedPersonHandler.execute(req))
                .rejects.toThrow(`Company number in association does not match the company number in the url`);

        });

        it("should error when association has a removed status", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";

            const associationId = "1234567890";
            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                }
            });

            getExtraDataSpy
                .mockReturnValueOnce(undefined);
            const removedAssociation = { ...singleAwaitingApprovalAssociation, status: AssociationStatus.REMOVED };

            getAssociationByIdSpy.mockResolvedValueOnce(removedAssociation);

            await expect(removeAuthorisedPersonHandler.execute(req))
                .rejects.toThrow(`Invalid association status`);

        });

    });

    describe("RemoveAuthorisedPersonHandler - handlePostRequest", () => {
        test.each([
            {
                reason: "removal unconfirmed",
                templateName: constants.REMOVE_AUTHORISED_PERSON_PAGE,
                association: singleConfirmedAssociation,
                errors: { confirmRemoval: { text: constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ } }
            },
            {
                reason: "removal for migrated association unconfirmed",
                templateName: constants.REMOVE_DO_NOT_RESTORE_PAGE,
                association: singleMigratedAssociation,
                errors: { confirmRemoval: { text: constants.CONFIRM_YOU_HAVE_READ } }
            },
            {
                reason: "cancellation unconfirmed",
                templateName: constants.CANCEL_PERSON_PAGE,
                association: singleAwaitingApprovalAssociation,
                errors: { confirmRemoval: { text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION } }
            }
        ])("should re-render page by calling res.render with correct template and viewData with errors populated if $reason",
            async ({ templateName, association, errors }) => {
                // Given
                const lang = "en";
                const companyNumber = "NI038379";

                const associationId = "1234567890";
                const req: Request = mockParametrisedRequest({
                    session: new Session(),
                    lang,
                    params: {
                        companyNumber,
                        associationId
                    }
                });

                const res = mockResponse();

                getExtraDataSpy
                    .mockReturnValueOnce(undefined);

                const translations = { key: "value" };
                getTranslationsForViewSpy.mockReturnValueOnce(translations);
                const expectedViewData = {
                    templateName,
                    backLinkHref: "/your-companies/manage-authorised-people/NI038379",
                    lang: translations,
                    companyName: association.companyName,
                    companyNumber: association.companyNumber,
                    userEmail: association.userEmail,
                    cancelLinkHref: "/your-companies/manage-authorised-people/NI038379",
                    currentStatus: association.status,
                    userName: association.userEmail,
                    errors

                };
                getAssociationByIdSpy.mockResolvedValueOnce(association);
                // When
                await removeAuthorisedPersonHandler.handlePostRequest(req, res);
                // Then
                expect(res.render).toHaveBeenCalledWith(templateName, expectedViewData);
            });

        it("should error when association company number does not match company no in url", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";
            const associationId = "1234567890";

            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                },
                body: {
                    confirmRemoval: "confirm"
                }
            });
            const res = mockResponse();
            getExtraDataSpy
                .mockReturnValueOnce({ ...singleConfirmedAssociation, companyNumber: "BadNumber" });

            // When
            await expect(removeAuthorisedPersonHandler.handlePostRequest(req, res))
                .rejects.toThrow(`Company number in association does not match the company number in the url`);
        });

        it("should redirect to manage authorised people page when removal is cancelled (when user has selected no)", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";
            const associationId = "1234567890";

            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                },
                body: {
                    confirmRemoval: "no"
                }
            });
            const res = mockResponse();

            // When
            await removeAuthorisedPersonHandler.handlePostRequest(req, res);
            // Then
            expect(res.redirect).toHaveBeenCalledWith("/your-companies/manage-authorised-people/NI038379");
        });

        test.each([
            {
                info: "association removal",
                association: singleConfirmedAssociation,
                redirectionUrl: `${constants.LANDING_URL}${constants.CONFIRMATION_PERSON_REMOVED_URL}`
            },
            {
                info: "migrated association removal",
                association: singleMigratedAssociation,
                redirectionUrl: `${constants.LANDING_URL}${constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_URL}`
            },
            {
                info: "association cancellation",
                association: singleAwaitingApprovalAssociation,
                redirectionUrl: `${constants.LANDING_URL}${constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_URL}`
            }
        ])("should process $info, save details to session and redirect to confirmation when user has selected to confirm",
            async ({ association, redirectionUrl }) => {
                // Given
                const lang = "en";
                const companyNumber = "NI038379";
                const associationId = "1234567890";
                const session = new Session();
                const req: Request = mockParametrisedRequest({
                    session,
                    lang,
                    params: {
                        companyNumber,
                        associationId
                    },
                    body: {
                        confirmRemoval: "confirm"
                    }
                });
                const expectedSavedRemovalForConfirmationPage = {
                    userNameOrEmail: association.userEmail,
                    companyNumber: association.companyNumber,
                    companyName: association.companyName
                };
                const res = mockResponse();
                getExtraDataSpy
                    .mockReturnValueOnce(association);
                // When
                await removeAuthorisedPersonHandler.handlePostRequest(req, res);
                // Then
                expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledWith(req, associationId);
                expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, constants.PERSON_REMOVED_CONFIRMATION_DATA, expectedSavedRemovalForConfirmationPage);
                expect(res.redirect).toHaveBeenCalledWith(redirectionUrl);
            });

        it("should throw an exception if association has unexpected status", async () => {
            // Given
            const lang = "en";
            const companyNumber = "NI038379";
            const associationId = "1234567890";

            const req: Request = mockParametrisedRequest({
                session: new Session(),
                lang,
                params: {
                    companyNumber,
                    associationId
                },
                body: {
                    confirmRemoval: "confirm"
                }
            });
            const res = mockResponse();
            getExtraDataSpy
                .mockReturnValueOnce(singleRemovedAssociation);
            // Then
            await expect(removeAuthorisedPersonHandler.handlePostRequest(req, res)).rejects.toThrow("Unexpected association status");
        });

        it("should handle self removal", async () => {
            // Given
            getLoggedInUserIdSpy.mockReturnValue(singleConfirmedAssociation.userId);
            const lang = "en";
            const companyNumber = "NI038379";
            const associationId = "1234567890";
            const session = new Session();
            const req: Request = mockParametrisedRequest({
                session,
                lang,
                params: {
                    companyNumber,
                    associationId
                },
                body: {
                    confirmRemoval: "confirm"
                }
            });
            const companyNameAndNumber = {
                companyName: singleConfirmedAssociation.companyName,
                companyNumber: singleConfirmedAssociation.companyNumber
            };
            const res = mockResponse();
            getExtraDataSpy
                .mockReturnValueOnce(singleConfirmedAssociation);
            // When
            await removeAuthorisedPersonHandler.handlePostRequest(req, res);
            // Then
            expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledWith(req, associationId);
            expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, constants.REMOVED_THEMSELVES_FROM_COMPANY, companyNameAndNumber);
            expect(res.redirect).toHaveBeenCalledWith("/your-companies/confirmation-person-removed-themselves");

        });

    });

});
