import { Router } from "express";
import {
    ADD_COMPANY_URL,
    CANCEL_PERSON_URL,
    MANAGE_AUTHORISED_PEOPLE_URL,
    YOUR_COMPANIES_URL
} from "../constants";
import { addCompanyControllerGet, addCompanyControllerPost } from "./controllers/addCompanyController";
import { manageAuthorisedPeopleControllerGet } from "./controllers/manageAuthorisedPeopleController";
import { yourCompaniesControllerGet } from "./controllers/yourCompaniesController";
import { cancelPersonControllerGet, cancelPersonControllerPost } from "./controllers/cancelPersonController";

const router: Router = Router();

router.get(YOUR_COMPANIES_URL, yourCompaniesControllerGet);

router.get(MANAGE_AUTHORISED_PEOPLE_URL, manageAuthorisedPeopleControllerGet);

router.get(ADD_COMPANY_URL, addCompanyControllerGet);
router.post(ADD_COMPANY_URL, addCompanyControllerPost);

router.get(CANCEL_PERSON_URL, cancelPersonControllerGet);
router.post(CANCEL_PERSON_URL, cancelPersonControllerPost);

export default router;
