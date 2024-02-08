import { Router } from "express";
import {
    ADD_COMPANY_URL,
    MANAGE_AUTHORISED_PEOPLE_URL,
    YOUR_COMPANIES_URL,
    pages
} from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet } from "./controllers/yourCompaniesController";
import { addPresenterControllerGet, addPresenterControllerPost } from "./controllers/addPresenterController";
import { checkPresenterControllerGet, checkPresenterControllerPost } from "./controllers/checkPresenterController";
import { emailAddedControllerGet } from "./controllers/emailAddedController";

const router: Router = Router();
export const SEPERATOR = "/";
const slash = (page:string) => SEPERATOR + page;

router.get(YOUR_COMPANIES_URL, yourCompaniesControllerGet);
router.get(MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleControllerGet);
router.get(ADD_COMPANY_URL, addCompanyControllerGet);
router.post(ADD_COMPANY_URL, addCompanyControllerPost);
router.get(ADD_COMPANY_URL, addCompanyControllerGet);
router.get(slash(pages.ADD_PRESENTER), addPresenterControllerGet);
router.post(SEPERATOR + pages.ADD_PRESENTER, addPresenterControllerPost);
router.get(SEPERATOR + pages.CHECK_PRESENTER, checkPresenterControllerGet);
router.post(SEPERATOR + pages.CHECK_PRESENTER, checkPresenterControllerPost);
router.get(SEPERATOR + pages.EMAIL_ADDED, emailAddedControllerGet);
export default router;
