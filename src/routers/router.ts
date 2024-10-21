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
import { removedThemselvesConfirmationControllerGet } from "./controllers/removeThemselvesConfirmationController";
import { presenterAlreadyAddedNavigation } from "../middleware/navigation/presenterAlreadyAdded.middleware";
import { removedThemselvesNavigation } from "../middleware/navigation/personRemovedThemselves.middleware";
import { removeAuthorisedPersonCompanyAuth } from "../middleware/companyAuthentication/remove.person.company.authentication";
import { companyAuthenticationMiddleware } from "../middleware/company.authentication";
import { removeCompanyConfirmedControllerGet } from "./controllers/removeCompanyConfirmedController";
import { removeCompanyControllerGet, removeCompanyControllerPost } from "./controllers/removeCompanyController";
import { somethingWentWrongControllerGet } from "./controllers/somethingWentWrongController";

const router: Router = Router();

router.get(constants.HEALTHCHECK, healthCheckController);

router.get(constants.YOUR_COMPANIES_URL, yourCompaniesControllerGet as RequestHandler);
router.post(constants.YOUR_COMPANIES_URL, yourCompaniesControllerPost as RequestHandler);

router.get(constants.MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.AUTHORISED_PERSON_ADDED_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL, manageAuthorisedPeopleNavigation, manageAuthorisedPeopleControllerGet as RequestHandler);

router.get(constants.ADD_COMPANY_URL, addCompanyControllerGet as RequestHandler);
router.post(constants.ADD_COMPANY_URL, addCompanyControllerPost as RequestHandler);
router.get(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL, removeAuthorisedPersonCompanyAuth, removeAuthorisedPersonNavigation, removeAuthorisedPersonControllerGet as RequestHandler);
router.post(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL, removeAuthorisedPersonCompanyAuth, removeAuthorisedPersonControllerPost as RequestHandler);
router.get(constants.REMOVE_ASSOCIATION_URL, removeAuthorisedPersonRequestController);
router.get(constants.REMOVED_THEMSELVES_URL, removedThemselvesNavigation, removedThemselvesConfirmationControllerGet as RequestHandler);

router.get(constants.REMOVE_COMPANY_URL, removeCompanyControllerGet as RequestHandler);
router.post(constants.REMOVE_COMPANY_URL, removeCompanyControllerPost as RequestHandler);
router.get(constants.REMOVE_COMPANY_CONFIRMED_URL, removeCompanyConfirmedControllerGet);

router.get(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL, companyAuthenticationMiddleware, cancelPersonNavigation, cancelPersonControllerGet as RequestHandler);
router.post(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL, companyAuthenticationMiddleware, cancelPersonControllerPost as RequestHandler);

router.get(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyNavigation, confirmCompanyControllerGet as RequestHandler);
router.post(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyControllerPost as RequestHandler);

router.get(constants.CREATE_COMPANY_ASSOCIATION_PATH, companyAuthenticationMiddleware, createCompanyAssociationControllerGet as RequestHandler);
router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAddedNavigation, companyAddedControllerGet as RequestHandler);

router.get(constants.ADD_PRESENTER_URL, addPresenterNavigation, addPresenterControllerGet as RequestHandler);
router.post(constants.ADD_PRESENTER_URL, addPresenterControllerPost as RequestHandler);

router.get(constants.CHECK_PRESENTER_URL, checkPresenterNavigation, checkPresenterControllerGet);
router.post(constants.CHECK_PRESENTER_URL, checkPresenterControllerPost);

router.get(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL, resendEmailController as RequestHandler);

router.get(constants.COMPANY_INVITATIONS_URL, companyInvitationsControllerGet as RequestHandler);
router.get(constants.COMPANY_INVITATIONS_DECLINE_URL, companyInvitationsDeclineNavigation, companyInvitationsDeclineControllerGet as RequestHandler);

router.get(constants.COMPANY_INVITATIONS_ACCEPT_URL, companyInvitationsAcceptNavigation, companyInvitationsAcceptControllerGet as RequestHandler);

router.get(constants.PRESENTER_ALREADY_ADDED_URL, presenterAlreadyAddedNavigation, presenterAlreadyAddedControllerGet);

router.get(constants.SOMETHING_WENT_WRONG_URL, somethingWentWrongControllerGet);

export default router;
