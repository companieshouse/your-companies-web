import { RequestHandler, Router } from "express";
import { createCompanyAssociationControllerGet } from "./controllers/createCompanyAssociationController";
import { confirmCompanyControllerGet, confirmCompanyControllerPost } from "./controllers/confirmCompanyController";
import { companyAddedControllerGet } from "./controllers/companyAddedController";
import * as constants from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet } from "./controllers/yourCompaniesController";
import { addPresenterController } from "./controllers/addPresenterController";
import { checkPresenterController } from "./controllers/checkPresenterController";
import { resendEmailController } from "./controllers/resendEmailController";
import { cancelPersonControllerGet, cancelPersonControllerPost } from "./controllers/cancelPersonController";

const router: Router = Router();

router.get(constants.YOUR_COMPANIES_URL, yourCompaniesControllerGet as RequestHandler);

router.get(constants.MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL, manageAuthorisedPeopleControllerGet as RequestHandler);
router.get(constants.AUTHORISED_PERSON_ADDED_URL, manageAuthorisedPeopleControllerGet as RequestHandler);

router.get(constants.ADD_COMPANY_URL, addCompanyControllerGet as RequestHandler);
router.post(constants.ADD_COMPANY_URL, addCompanyControllerPost as RequestHandler);

router.get(constants.CANCEL_PERSON_URL, cancelPersonControllerGet as RequestHandler);
router.post(constants.CANCEL_PERSON_URL, cancelPersonControllerPost as RequestHandler);

router.get(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyControllerGet as RequestHandler);
router.post(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyControllerPost as RequestHandler);

router.get(constants.CREATE_COMPANY_ASSOCIATION_PATH, createCompanyAssociationControllerGet as RequestHandler);
router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAddedControllerGet as RequestHandler);

router.get(constants.ADD_PRESENTER_URL, addPresenterController as RequestHandler);
router.post(constants.ADD_PRESENTER_URL, addPresenterController as RequestHandler);

router.get(constants.CHECK_PRESENTER_URL, checkPresenterController as RequestHandler);
router.post(constants.CHECK_PRESENTER_URL, checkPresenterController as RequestHandler);

router.get(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL, resendEmailController as RequestHandler);

export default router;
