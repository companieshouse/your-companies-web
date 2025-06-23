import { RequestHandler, Router } from "express";
import { createCompanyAssociationControllerGet } from "./controllers/createCompanyAssociationController";
import { confirmCompanyControllerGet, confirmCompanyControllerPost } from "./controllers/confirmCompanyController";
import { companyAddedControllerGet } from "./controllers/companyAddedController";
import * as constants from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet, yourCompaniesControllerPost } from "./controllers/yourCompaniesController";
import { addPresenterControllerGet, addPresenterControllerPost } from "./controllers/addPresenterController";
import { checkPresenterControllerGet, checkPresenterControllerPost } from "./controllers/checkPresenterController";
import { resendEmailController } from "./controllers/resendEmailController";
import { cancelPersonControllerGet, cancelPersonControllerPost } from "./controllers/cancelPersonController";
import { companyInvitationsControllerGet } from "./controllers/companyInvitationsController";
import { companyInvitationsAcceptControllerGet } from "./controllers/companyInvitationsAcceptController";
import { removeAuthorisedPersonControllerGet, removeAuthorisedPersonControllerPost } from "./controllers/removeAuthorisedPersonController";
import { companyInvitationsDeclineControllerGet } from "./controllers/companyInvitationsDeclineController";
import { healthCheckController } from "./controllers/healthCheckController";
import { presenterAlreadyAddedControllerGet } from "./controllers/presenterAlreadyAddedController";
import { removeAuthorisedPersonRequestController } from "./controllers/removeAuthorisedPersonRequestController";
import { removedThemselvesConfirmationControllerGet } from "./controllers/removedThemselvesConfirmationController";
import { removeAuthorisedPersonCompanyAuth } from "../middleware/companyAuthentication/remove.person.company.authentication";
import { companyAuthenticationMiddleware } from "../middleware/company.authentication";
import { removeCompanyConfirmedControllerGet } from "./controllers/removeCompanyConfirmedController";
import { removeCompanyControllerGet, removeCompanyControllerPost } from "./controllers/removeCompanyController";
import { somethingWentWrongControllerGet } from "./controllers/somethingWentWrongController";
import {
    confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet,
    confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost
} from "./controllers/confirmCompanyDetailsForRestoringYourDigitalAuthorisationController";
import { tryRestoringYourDigitalAuthorisationControllerGet } from "./controllers/tryRestoringYourDigitalAuthorisationController";
import { confirmationYourDigitalAuthorisationRestoredControllerGet } from "./controllers/confirmationYourDigitalAuthorisationRestoredController";
import {
    sendEmailToBeDigitallyAuthorisedControllerGet,
    sendEmailToBeDigitallyAuthorisedControllerPost
} from "./controllers/sendEmailToBeDigitallyAuthorisedController";
import { removeAuthorisationDoNotRestoreControllerGet, removeAuthorisationDoNotRestoreControllerPost } from "./controllers/removeAuthorisationDoNotRestoreController";
import { confirmationAuthorisationRemovedControllerGet } from "./controllers/confirmationAuthorisationRemovedController";

const router: Router = Router();

// Health Check
router.get(constants.HEALTHCHECK_URL, healthCheckController);

// Your Companies
router.route(constants.YOUR_COMPANIES_URL)
    .get(yourCompaniesControllerGet as RequestHandler)
    .post(yourCompaniesControllerPost as RequestHandler);

// Manage Authorised People
router.get(constants.MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.AUTHORISED_PERSON_ADDED_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL, manageAuthorisedPeopleControllerGet as RequestHandler);

// Add Company
router.route(constants.ADD_COMPANY_URL)
    .get(addCompanyControllerGet as RequestHandler)
    .post(addCompanyControllerPost as RequestHandler);

// Remove Authorised Person
router.route(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL)
    .get(removeAuthorisedPersonCompanyAuth, removeAuthorisedPersonControllerGet as RequestHandler)
    .post(removeAuthorisedPersonCompanyAuth, removeAuthorisedPersonControllerPost as RequestHandler);

router.get(constants.REMOVE_ASSOCIATION_URL, removeAuthorisedPersonRequestController);
router.get(constants.REMOVED_THEMSELVES_URL, removedThemselvesConfirmationControllerGet as RequestHandler);

// Remove Company
router.route(constants.REMOVE_COMPANY_URL)
    .get(removeCompanyControllerGet as RequestHandler)
    .post(removeCompanyControllerPost as RequestHandler);

router.get(constants.REMOVE_COMPANY_CONFIRMED_URL, removeCompanyConfirmedControllerGet);

// Cancel Person
router.route(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL)
    .get(companyAuthenticationMiddleware, cancelPersonControllerGet as RequestHandler)
    .post(companyAuthenticationMiddleware, cancelPersonControllerPost as RequestHandler);

// Confirm Company
router.route(constants.CONFIRM_COMPANY_DETAILS_URL)
    .get(confirmCompanyControllerGet as RequestHandler)
    .post(confirmCompanyControllerPost as RequestHandler);

// Create Company Association
router.get(constants.CREATE_COMPANY_ASSOCIATION_URL, companyAuthenticationMiddleware, createCompanyAssociationControllerGet as RequestHandler);

// Company Added
router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAddedControllerGet as RequestHandler);

// Add Presenter
router.route(constants.ADD_PRESENTER_URL)
    .get(addPresenterControllerGet as RequestHandler)
    .post(addPresenterControllerPost as RequestHandler);

// Check Presenter
router.route(constants.CHECK_PRESENTER_URL)
    .get(checkPresenterControllerGet)
    .post(checkPresenterControllerPost);

// Resend Email
router.get(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL, resendEmailController as RequestHandler);

// Company Invitations
router.get(constants.COMPANY_INVITATIONS_URL, companyInvitationsControllerGet as RequestHandler);
router.get(constants.COMPANY_INVITATIONS_DECLINE_URL, companyInvitationsDeclineControllerGet as RequestHandler);
router.get(constants.COMPANY_INVITATIONS_ACCEPT_URL, companyInvitationsAcceptControllerGet as RequestHandler);

// Presenter Already Added
router.get(constants.PRESENTER_ALREADY_ADDED_URL, presenterAlreadyAddedControllerGet);

// Something Went Wrong
router.get(constants.SOMETHING_WENT_WRONG_URL, somethingWentWrongControllerGet);

// Confirm Company Details For Restoring Your Digital Authorisation
router.route(constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL)
    .get(confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet)
    .post(confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost);

// Try Restoring Your Digital Authorisation
router.get(constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL, companyAuthenticationMiddleware, tryRestoringYourDigitalAuthorisationControllerGet);

// Restore Your Digital Authorication Success
router.get(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL, confirmationYourDigitalAuthorisationRestoredControllerGet);

// Send Email To Be Digitally Authorised
router.route(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL)
    .get(sendEmailToBeDigitallyAuthorisedControllerGet)
    .post(sendEmailToBeDigitallyAuthorisedControllerPost);

// Remove Authorisation Do Not Restore
router.get(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL, removeAuthorisationDoNotRestoreControllerGet);
router.post(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL, removeAuthorisationDoNotRestoreControllerPost);

// Confirmation Authorisation Removed
router.get(constants.CONFIRMATION_AUTHORISATION_REMOVED_URL, confirmationAuthorisationRemovedControllerGet);

export default router;
