import { Request } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../../src/constants";
import { RemoveAuthorisedPersonHandler } from "../../../../../../src/routers/handlers/yourCompanies/removeAuthorisedPersonHandler";
import { Session } from "@companieshouse/node-session-handler";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import * as associationsService from "../../../../../../src/services/associationsService";
// import { singleAwaitingApprovalAssociation, singleMigratedAssociation, singleRemovedAssociation } from "../../../../../mocks/associations.mock";
import { singleAwaitingApprovalAssociation, singleConfirmedAssociation } from "../../../../../mocks/associations.mock";
import { mockResponse } from "../../../../../mocks/response.mock";
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
// const deleteExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "deleteExtraData");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const removeUserFromCompanyAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "removeUserFromCompanyAssociations");
const getAssociationByIdSpy: jest.SpyInstance = jest.spyOn(associationsService, "getAssociationById");

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
                .mockReturnValueOnce({ cancelPerson: { text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION } });

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
                errors: { cancelPerson: { text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION } }
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

    });

    describe("RemoveAuthorisedPersonHandler - handlePostRequest", () => {
        it("should re-render page by calling res.render with correct template and correct viewData with errors populated if removal unconfirmed", async () => {
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
                templateName: constants.REMOVE_AUTHORISED_PERSON_PAGE,
                backLinkHref: "/your-companies/manage-authorised-people/NI038379",
                lang: translations,
                companyName: singleConfirmedAssociation.companyName,
                companyNumber: singleConfirmedAssociation.companyNumber,
                userEmail: singleConfirmedAssociation.userEmail,
                cancelLinkHref: "/your-companies/manage-authorised-people/NI038379",
                currentStatus: singleConfirmedAssociation.status,
                userName: singleConfirmedAssociation.userEmail,
                errors: { confirmRemoval: { text: "select_if_you_confirm_that_you_have_read" } }

            };
            getAssociationByIdSpy.mockResolvedValueOnce(singleConfirmedAssociation);
            // When
            await removeAuthorisedPersonHandler.handlePostRequest(req, res);
            // Then
            expect(res.render).toHaveBeenCalledWith(constants.REMOVE_AUTHORISED_PERSON_PAGE, expectedViewData);
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

        it("should process association removal, save details to session and redirect to confirmation when user has selected to confirm", async () => {
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
            const savedAssociation = {
                userEmail: singleConfirmedAssociation.userEmail,
                userName: singleConfirmedAssociation.userEmail,
                companyNumber: singleConfirmedAssociation.companyNumber,
                status: singleConfirmedAssociation.status
            };
            const res = mockResponse();
            getExtraDataSpy
                .mockReturnValueOnce(singleConfirmedAssociation);
            // When
            await removeAuthorisedPersonHandler.handlePostRequest(req, res);
            // Then
            expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledWith(req, associationId);
            expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, "removePerson", savedAssociation);
            expect(res.redirect).toHaveBeenCalledWith("/your-companies/manage-authorised-people/NI038379/confirmation-person-removed");
        });

        it("should process association removal, save details to session and redirect to remove themselves confirmation when user is removing themselves", async () => {
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
            const savedAssociation = {
                userEmail: singleConfirmedAssociation.userEmail,
                userName: singleConfirmedAssociation.userEmail,
                companyNumber: singleConfirmedAssociation.companyNumber,
                status: singleConfirmedAssociation.status
            };
            const res = mockResponse();
            getExtraDataSpy
                .mockReturnValueOnce(singleConfirmedAssociation);
            // When
            await removeAuthorisedPersonHandler.handlePostRequest(req, res);
            // Then
            expect(removeUserFromCompanyAssociationsSpy).toHaveBeenCalledWith(req, associationId);
            expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, "removePerson", savedAssociation);
            expect(res.redirect).toHaveBeenCalledWith("/your-companies/manage-authorised-people/NI038379/confirmation-person-removed");
        });

    });

});
