import { Router } from "express";
import { createCompanyAssociationControllerGet } from "./controllers/createCompanyAssociationController";
import { confirmCompanyControllerGet, confirmCompanyControllerPost } from "./controllers/confirmCompanyController";
import { companyAddedControllerGet } from "./controllers/companyAddedController";
import * as constants from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet } from "./controllers/yourCompaniesController";
import { addPresenterController } from "./controllers/addPresenterController";
import { checkPresenterController } from "./controllers/checkPresenterController";
import { cancelPersonControllerGet, cancelPersonControllerPost } from "./controllers/cancelPersonController";
import { isComingFromCheckEmailPage } from "../middleware/navigation.middleware";

const router: Router = Router();

router.get(constants.YOUR_COMPANIES_URL, yourCompaniesControllerGet);

router.get(constants.MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleControllerGet);
router.get(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL, manageAuthorisedPeopleControllerGet);
router.get(constants.AUTHORISED_PERSON_ADDED_URL, isComingFromCheckEmailPage, manageAuthorisedPeopleControllerGet);

router.get(constants.ADD_COMPANY_URL, addCompanyControllerGet);
router.post(constants.ADD_COMPANY_URL, addCompanyControllerPost);

router.get(constants.CANCEL_PERSON_URL, cancelPersonControllerGet);
router.post(constants.CANCEL_PERSON_URL, cancelPersonControllerPost);

router.get(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyControllerGet);
router.post(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyControllerPost);

router.get(constants.CREATE_COMPANY_ASSOCIATION_PATH, createCompanyAssociationControllerGet);
router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAddedControllerGet);

router.get(constants.ADD_PRESENTER_URL, addPresenterController);
router.post(constants.ADD_PRESENTER_URL, addPresenterController);

router.get(constants.CHECK_PRESENTER_URL, checkPresenterController);
router.post(constants.CHECK_PRESENTER_URL, checkPresenterController);

export default router;
