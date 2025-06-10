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
import { addPresenterNavigation } from "../middleware/navigation/addPresenter.middleware";
import { cancelPersonNavigation } from "../middleware/navigation/cancelPerson.middleware";
import { checkPresenterNavigation } from "../middleware/navigation/checkPresenter.middleware";
import { companyAddedNavigation } from "../middleware/navigation/companyAdded.middleware";
import { companyInvitationsAcceptNavigation } from "../middleware/navigation/companyInvitationsAccept.middleware";
import { companyInvitationsDeclineNavigation } from "../middleware/navigation/companyInvitationsDecline.middleware";
import { confirmCompanyNavigation } from "../middleware/navigation/confirmCompany.middleware";
import { manageAuthorisedPeopleNavigation } from "../middleware/navigation/manageAuthorisedPeople.middleware";
import { removeAuthorisedPersonNavigation } from "../middleware/navigation/removeAuthorisedPerson.middleware";
import { removeAuthorisedPersonRequestController } from "./controllers/removeAuthorisedPersonRequestController";
import { removedThemselvesConfirmationControllerGet } from "./controllers/removedThemselvesConfirmationController";
import { presenterAlreadyAddedNavigation } from "../middleware/navigation/presenterAlreadyAdded.middleware";
import { removedThemselvesNavigation } from "../middleware/navigation/personRemovedThemselves.middleware";
import { removeAuthorisedPersonCompanyAuth } from "../middleware/companyAuthentication/remove.person.company.authentication";
import { companyAuthenticationMiddleware, forceCompanyAuthenticationMiddleware } from "../middleware/company.authentication";
import { removeCompanyConfirmedControllerGet } from "./controllers/removeCompanyConfirmedController";
import { removeCompanyControllerGet, removeCompanyControllerPost } from "./controllers/removeCompanyController";
import { somethingWentWrongControllerGet } from "./controllers/somethingWentWrongController";
import { removeCompanyNavigation } from "../middleware/navigation/removeCompany.middleware";
import { confirmationCompanyRemovedNavigation } from "../middleware/navigation/confirmationCompanyRemoved.middleware";

const router: Router = Router();

// Health Check
router.get(constants.HEALTHCHECK_URL, healthCheckController);

// Your Companies
router.route(constants.YOUR_COMPANIES_URL)
    .get(yourCompaniesControllerGet as RequestHandler)
    .post(yourCompaniesControllerPost as RequestHandler);

// Manage Authorised People
router.get(constants.MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.AUTHORISED_PERSON_ADDED_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);

// Add Company
router.route(constants.ADD_COMPANY_URL)
    .get(addCompanyControllerGet as RequestHandler)
    .post(addCompanyControllerPost as RequestHandler);

// Remove Authorised Person
router.route(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL)
    .get(removeAuthorisedPersonCompanyAuth, removeAuthorisedPersonNavigation, removeAuthorisedPersonControllerGet as RequestHandler)
    .post(removeAuthorisedPersonCompanyAuth, removeAuthorisedPersonControllerPost as RequestHandler);

router.get(constants.REMOVE_ASSOCIATION_URL, removeAuthorisedPersonRequestController);
router.get(constants.REMOVED_THEMSELVES_URL, removedThemselvesNavigation, removedThemselvesConfirmationControllerGet as RequestHandler);

// Remove Company
router.route(constants.REMOVE_COMPANY_URL)
    .get(removeCompanyNavigation, removeCompanyControllerGet as RequestHandler)
    .post(removeCompanyControllerPost as RequestHandler);

router.get(constants.REMOVE_COMPANY_CONFIRMED_URL, confirmationCompanyRemovedNavigation, removeCompanyConfirmedControllerGet);

// Cancel Person
router.route(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL)
    .get(forceCompanyAuthenticationMiddleware, cancelPersonNavigation, cancelPersonControllerGet as RequestHandler)
    .post(companyAuthenticationMiddleware, cancelPersonControllerPost as RequestHandler);

// Confirm Company
router.route(constants.CONFIRM_COMPANY_DETAILS_URL)
    .get(confirmCompanyNavigation, confirmCompanyControllerGet as RequestHandler)
    .post(confirmCompanyControllerPost as RequestHandler);

// Create Company Association
router.get(constants.CREATE_COMPANY_ASSOCIATION_URL, companyAuthenticationMiddleware, createCompanyAssociationControllerGet as RequestHandler);

// Company Added
router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAddedNavigation, companyAddedControllerGet as RequestHandler);

// Add Presenter
router.route(constants.ADD_PRESENTER_URL)
    .get(addPresenterNavigation, addPresenterControllerGet as RequestHandler)
    .post(addPresenterControllerPost as RequestHandler);

// Check Presenter
router.route(constants.CHECK_PRESENTER_URL)
    .get(checkPresenterNavigation, checkPresenterControllerGet)
    .post(checkPresenterControllerPost);

// Resend Email
router.get(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL, resendEmailController as RequestHandler);

// Company Invitations
router.get(constants.COMPANY_INVITATIONS_URL, companyInvitationsControllerGet as RequestHandler);
router.get(constants.COMPANY_INVITATIONS_DECLINE_URL, companyInvitationsDeclineNavigation, companyInvitationsDeclineControllerGet as RequestHandler);
router.get(constants.COMPANY_INVITATIONS_ACCEPT_URL, companyInvitationsAcceptNavigation, companyInvitationsAcceptControllerGet as RequestHandler);

// Presenter Already Added
router.get(constants.PRESENTER_ALREADY_ADDED_URL, presenterAlreadyAddedNavigation, presenterAlreadyAddedControllerGet);

// Something Went Wrong
router.get(constants.SOMETHING_WENT_WRONG_URL, somethingWentWrongControllerGet);

export default router;
