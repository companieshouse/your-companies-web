import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import {
    COMPANY_NUMBER,
    LANDING_URL,
    MANAGE_AUTHORISED_PEOPLE_LANG,
    YOUR_COMPANIES_ADD_NEW_AUTHORISED_PERSON_URL,
    YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE,
    YOUR_COMPANIES_CANCEL_PERSON_URL,
    YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL
} from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { Associations } from "../../../types/associations";
import { getCompanyAssociations } from "../../../services/userCompanyAssociationService";

export class ManageAuthorisedPeopleHandler extends GenericHandler {

    async execute (req: Request, res: Response): Promise<Object> {
        logger.info(`GET request to serve People Digitaly Authorised To File Online For This Company page`);
        // ...process request here and return data for the view
        this.viewData = this.getViewData();
        this.viewData.lang = getTranslationsForView(req.t, MANAGE_AUTHORISED_PEOPLE_LANG);
        const companyNumber: string = req.params[COMPANY_NUMBER];
        const companyAssociations: Associations = await getCompanyAssociations(companyNumber);
        this.viewData.companyAssociations = companyAssociations;
        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        return {
            backLinkHref: LANDING_URL,
            buttonHref: YOUR_COMPANIES_ADD_NEW_AUTHORISED_PERSON_URL,
            cancelUrl: YOUR_COMPANIES_CANCEL_PERSON_URL,
            resendEmailUrl: YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            removeUrl: YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE
        };
    }
}
