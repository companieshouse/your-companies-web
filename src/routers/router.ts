import { RequestHandler, Router } from "express";
import { confirmCompanyControllerGet, confirmCompanyControllerPost } from "./controllers/confirmCompanyController";
import { companyAddedControllerGet } from "./controllers/companyAddedController";
import * as constants from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet, manageAuthorisedPeopleControllerPost } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet, yourCompaniesControllerPost } from "./controllers/yourCompaniesController";
import { addPresenterControllerGet, addPresenterControllerPost } from "./controllers/addPresenterController";
import { checkPresenterControllerGet, checkPresenterControllerPost } from "./controllers/checkPresenterController";
import { resendEmailController } from "./controllers/resendEmailController";
import { companyInvitationsControllerGet } from "./controllers/companyInvitationsController";
import { companyInvitationsAcceptControllerGet } from "./controllers/companyInvitationsAcceptController";
import { removeAuthorisedPersonControllerGet, removeAuthorisedPersonControllerPost } from "./controllers/removeAuthorisedPersonController";
import { companyInvitationsDeclineControllerGet } from "./controllers/companyInvitationsDeclineController";
import { healthCheckController } from "./controllers/healthCheckController";
import { presenterAlreadyAddedControllerGet } from "./controllers/presenterAlreadyAddedController";
import { removedThemselvesConfirmationControllerGet } from "./controllers/removedThemselvesConfirmationController";
import { removeAuthorisedPersonCompanyAuth } from "../middleware/companyAuthentication/remove.person.company.authentication";
import { companyAuthenticationMiddlewareCheckboxDisabled } from "../middleware/company.authentication";
import { removeCompanyConfirmedControllerGet } from "./controllers/removeCompanyConfirmedController";
import { removeCompanyControllerGet, removeCompanyControllerPost } from "./controllers/removeCompanyController";
import { somethingWentWrongControllerGet } from "./controllers/somethingWentWrongController";
import {
    confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet,
    confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost
} from "./controllers/confirmCompanyDetailsForRestoringYourDigitalAuthorisationController";
import { confirmationYourDigitalAuthorisationRestoredControllerGet } from "./controllers/confirmationYourDigitalAuthorisationRestoredController";
import {
    sendEmailToBeDigitallyAuthorisedControllerGet,
    sendEmailToBeDigitallyAuthorisedControllerPost
} from "./controllers/sendEmailToBeDigitallyAuthorisedController";
import { removeAuthorisationDoNotRestoreControllerGet, removeAuthorisationDoNotRestoreControllerPost } from "./controllers/removeAuthorisationDoNotRestoreController";
import { confirmationAuthorisationRemovedControllerGet } from "./controllers/confirmationAuthorisationRemovedController";
import { navigationMiddleware } from "../middleware/navigation.middleware";
import { confirmationPersonRemovedControllerGet } from "./controllers/confirmationPersonRemovedController";
import { confirmationAuthorisationEmailResentControllerGet } from "./controllers/confirmationAuthorisationEmailResentController";
import { confirmationPersonsDigitalAuthorisationCancelledControllerGet } from "./controllers/confirmationPersonsDigitalAuthorisationCancelledController";
import { confirmationPersonsDigitalAuthorisationRestoredControllerGet } from "./controllers/confirmationPersonsDigitalAuthorisationRestoredController";
import { confirmationPersonsDigitalAuthorisationRemovedNotRestoredControllerGet } from "./controllers/confirmationPersonsDigitalAuthorisationRemovedNotRestoredController";
import { confirmationPersonAddedControllerGet } from "./controllers/confirmationPersonAddedController";
import { createCmsBannerMiddleare } from "../middleware/cms.banner.middleware";

const router: Router = Router();

// Health Check
router.get(constants.HEALTHCHECK_URL, healthCheckController);

// Your Companies
router.get(constants.YOUR_COMPANIES_URL, createCmsBannerMiddleare("your-companies-banner"), yourCompaniesControllerGet as RequestHandler);
router.post(constants.YOUR_COMPANIES_URL, createCmsBannerMiddleare("your-companies-banner"), yourCompaniesControllerPost as RequestHandler);

// Manage Authorised People
router.get(constants.MANAGE_AUTHORISED_PEOPLE_URL, navigationMiddleware, manageAuthorisedPeopleControllerGet as RequestHandler);
router.post(constants.MANAGE_AUTHORISED_PEOPLE_URL, navigationMiddleware, manageAuthorisedPeopleControllerPost as RequestHandler);

// Add Company
router.get(constants.ADD_COMPANY_URL, navigationMiddleware, addCompanyControllerGet as RequestHandler);
router.post(constants.ADD_COMPANY_URL, addCompanyControllerPost as RequestHandler);

// Remove Authorised Person
router.get(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL, removeAuthorisedPersonCompanyAuth, navigationMiddleware, removeAuthorisedPersonControllerGet as RequestHandler);
router.post(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL, removeAuthorisedPersonCompanyAuth, removeAuthorisedPersonControllerPost as RequestHandler);

router.get(constants.REMOVED_THEMSELVES_URL, navigationMiddleware, removedThemselvesConfirmationControllerGet as RequestHandler);

// Remove Company
router.get(constants.REMOVE_COMPANY_URL, navigationMiddleware, removeCompanyControllerGet as RequestHandler);
router.post(constants.REMOVE_COMPANY_URL, removeCompanyControllerPost as RequestHandler);

router.get(constants.REMOVE_COMPANY_CONFIRMED_URL, navigationMiddleware, removeCompanyConfirmedControllerGet);

// Confirm Company
router.get(constants.CONFIRM_COMPANY_DETAILS_URL, navigationMiddleware, confirmCompanyControllerGet as RequestHandler);
router.post(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyControllerPost as RequestHandler);

// Company Added
router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAuthenticationMiddlewareCheckboxDisabled, navigationMiddleware, companyAddedControllerGet as RequestHandler);

// Add Presenter
router.get(constants.ADD_PRESENTER_URL, navigationMiddleware, addPresenterControllerGet as RequestHandler);
router.post(constants.ADD_PRESENTER_URL, addPresenterControllerPost as RequestHandler);

// Check Presenter
router.get(constants.CHECK_PRESENTER_URL, navigationMiddleware, checkPresenterControllerGet);
router.post(constants.CHECK_PRESENTER_URL, checkPresenterControllerPost);

// Resend Email
router.get(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL, navigationMiddleware, resendEmailController as RequestHandler);

// Company Invitations
router.get(constants.COMPANY_INVITATIONS_URL, navigationMiddleware, companyInvitationsControllerGet as RequestHandler);
router.get(constants.COMPANY_INVITATIONS_DECLINE_URL, navigationMiddleware, companyInvitationsDeclineControllerGet as RequestHandler);
router.get(constants.COMPANY_INVITATIONS_ACCEPT_URL, navigationMiddleware, companyInvitationsAcceptControllerGet as RequestHandler);

// Presenter Already Added
router.get(constants.PRESENTER_ALREADY_ADDED_URL, navigationMiddleware, presenterAlreadyAddedControllerGet);

// Something Went Wrong
router.get(constants.SOMETHING_WENT_WRONG_URL, navigationMiddleware, somethingWentWrongControllerGet);

// Confirm Company Details For Restoring Your Digital Authorisation
router.get(constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL, navigationMiddleware, confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet);
router.post(constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL, confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost);

// Restore Your Digital Authorication Success
router.get(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL, companyAuthenticationMiddlewareCheckboxDisabled, navigationMiddleware, confirmationYourDigitalAuthorisationRestoredControllerGet);

// Send Email To Be Digitally Authorised
router.get(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL, navigationMiddleware, sendEmailToBeDigitallyAuthorisedControllerGet);
router.post(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL, sendEmailToBeDigitallyAuthorisedControllerPost);

// Remove Authorisation Do Not Restore
router.get(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL, navigationMiddleware, removeAuthorisationDoNotRestoreControllerGet);
router.post(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL, removeAuthorisationDoNotRestoreControllerPost);

// Confirmation Authorisation Removed
router.get(constants.CONFIRMATION_AUTHORISATION_REMOVED_URL, navigationMiddleware, confirmationAuthorisationRemovedControllerGet);

// Confirmation Person Removed
router.get(constants.CONFIRMATION_PERSON_REMOVED_URL, navigationMiddleware, confirmationPersonRemovedControllerGet);

// Confirmation Authorisation Email Resent
router.get(constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL, navigationMiddleware, confirmationAuthorisationEmailResentControllerGet);

// Confirmation Person's Digital Authorisation Cancelled
router.get(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_URL, navigationMiddleware, confirmationPersonsDigitalAuthorisationCancelledControllerGet);

// Confirmation Person's Digital Authorisation Restored
router.get(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_URL, navigationMiddleware, confirmationPersonsDigitalAuthorisationRestoredControllerGet);

// Confirmation Person's Digital Authorisation Removed Not Restored
router.get(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_URL, navigationMiddleware, confirmationPersonsDigitalAuthorisationRemovedNotRestoredControllerGet);

// Confirmation Person Added
router.get(constants.CONFIRMATION_PERSON_ADDED_URL, navigationMiddleware, confirmationPersonAddedControllerGet);

export default router;
