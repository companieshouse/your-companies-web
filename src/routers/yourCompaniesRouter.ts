import { Router } from "express";
import {
    ADD_COMPANY_URL,
    MANAGE_AUTHORISED_PEOPLE_URL,
    YOUR_COMPANIES_URL
} from "../constants";
import { createTransaction } from "./controllers/createTransaction";
import { confirmCompanyGet, confirmCompanyPost } from "./controllers/confirmCompany";
import { companyAdded } from "./controllers/companyAdded";
import * as constants from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet } from "./controllers/yourCompaniesController";

const router: Router = Router();

router.get(YOUR_COMPANIES_URL, yourCompaniesControllerGet);
router.get(MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleControllerGet);
router.get(ADD_COMPANY_URL, addCompanyControllerGet);
router.post(ADD_COMPANY_URL, addCompanyControllerPost);

router.get(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyGet);

router.post(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyPost);

router.get(constants.CREATE_TRANSACTION_PATH, createTransaction);

router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAdded);

export default router;
