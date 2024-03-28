import { RequestHandler, Router } from "express";
import { createCompanyAssociationControllerGet } from "./controllers/createCompanyAssociationController";
import { confirmCompanyControllerGet, confirmCompanyControllerPost } from "./controllers/confirmCompanyController";
import { companyAddedControllerGet } from "./controllers/companyAddedController";
import * as constants from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet, yourCompaniesControllerPost } from "./controllers/yourCompaniesController";
import { addPresenterControllerGet, addPresenterControllerPost } from "./controllers/addPresenterController";
import { checkPresenterController } from "./controllers/checkPresenterController";
import { resendEmailController } from "./controllers/resendEmailController";
import { cancelPersonControllerGet, cancelPersonControllerPost } from "./controllers/cancelPersonController";
import { companyInvitationsControllerGet } from "./controllers/companyInvitationsController";
import { companyInvitationsAcceptControllerGet } from "./controllers/companyInvitationsAcceptController";
import { removeAuthorisedPersonControllerGet, removeAuthorisedPersonControllerPost } from "./controllers/removeAuthorisedPersonController";
import { companyInvitationsDeclineControllerGet } from "./controllers/companyInvitationsDeclineController";
import { healthCheckController } from "./controllers/healthCheckController";

const router: Router = Router();

router.get(constants.HEALTHCHECK, healthCheckController);

router.get(constants.YOUR_COMPANIES_URL, yourCompaniesControllerGet as RequestHandler);
router.post(constants.YOUR_COMPANIES_URL, yourCompaniesControllerPost);

router.get(constants.MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.AUTHORISED_PERSON_ADDED_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL, manageAuthorisedPeopleControllerGet as RequestHandler);

router.get(constants.ADD_COMPANY_URL, addCompanyControllerGet as RequestHandler);
router.post(constants.ADD_COMPANY_URL, addCompanyControllerPost as RequestHandler);
router.get(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL, removeAuthorisedPersonControllerGet as RequestHandler);
router.post(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL, removeAuthorisedPersonControllerPost as RequestHandler);

router.get(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL, cancelPersonControllerGet as RequestHandler);
router.post(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL, cancelPersonControllerPost as RequestHandler);

router.get(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyControllerGet as RequestHandler);
router.post(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyControllerPost as RequestHandler);

router.get(constants.CREATE_COMPANY_ASSOCIATION_PATH, createCompanyAssociationControllerGet as RequestHandler);
router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAddedControllerGet as RequestHandler);

router.get(constants.ADD_PRESENTER_URL, addPresenterControllerGet as RequestHandler);
router.post(constants.ADD_PRESENTER_URL, addPresenterControllerPost as RequestHandler);

router.get(constants.CHECK_PRESENTER_URL, checkPresenterController as RequestHandler);
router.post(constants.CHECK_PRESENTER_URL, checkPresenterController as RequestHandler);

router.get(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL, resendEmailController as RequestHandler);

router.get(constants.COMPANY_INVITATIONS_URL, companyInvitationsControllerGet as RequestHandler);
router.get(constants.COMPANY_INVITATIONS_DECLINE_URL, companyInvitationsDeclineControllerGet as RequestHandler);

router.get(constants.COMPANY_INVITATIONS_ACCEPT_URL, companyInvitationsAcceptControllerGet as RequestHandler);

export default router;
