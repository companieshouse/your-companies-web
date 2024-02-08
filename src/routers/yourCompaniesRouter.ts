import { Router } from "express";
import {
    ADD_COMPANY_URL,
    MANAGE_AUTHORISED_PEOPLE_URL,
    YOUR_COMPANIES_URL,
    pathsWithCompanyAuth
} from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet } from "./controllers/yourCompaniesController";
import { addPresenterControllerGet, addPresenterControllerPost } from "./controllers/addPresenterController";
import { checkPresenterControllerGet, checkPresenterControllerPost } from "./controllers/checkPresenterController";
import { emailAddedControllerGet } from "./controllers/emailAddedController";

const router: Router = Router();

router.get(YOUR_COMPANIES_URL, yourCompaniesControllerGet);
router.get(MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleControllerGet);
router.get(ADD_COMPANY_URL, addCompanyControllerGet);
router.post(ADD_COMPANY_URL, addCompanyControllerPost);
router.get(ADD_COMPANY_URL, addCompanyControllerGet);
router.get(pathsWithCompanyAuth.ADD_PRESENTER, addPresenterControllerGet);
router.post(pathsWithCompanyAuth.ADD_PRESENTER, addPresenterControllerPost);
router.get(pathsWithCompanyAuth.CHECK_PRESENTER, checkPresenterControllerGet);
router.post(pathsWithCompanyAuth.CHECK_PRESENTER, checkPresenterControllerPost);
router.get(pathsWithCompanyAuth.EMAIL_ADDED, emailAddedControllerGet);
export default router;
