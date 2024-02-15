import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import {
    COMPANY_NAME,
    COMPANY_NUMBER,
    LANDING_URL,
    MANAGE_AUTHORISED_PEOPLE_LANG,
    REFERER_URL,
    YOUR_COMPANIES_ADD_NEW_AUTHORISED_PERSON_URL,
    YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL,
    YOUR_COMPANIES_CANCEL_PERSON_URL,
    YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
    YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL
} from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { Associations } from "../../../types/associations";
import { getCompanyAssociations } from "../../../services/userCompanyAssociationService";
import { setExtraData } from "../../../lib/utils/sessionUtils";

export class ManageAuthorisedPeopleHandler extends GenericHandler {

    async execute (req: Request, res: Response): Promise<Object> {
        logger.info(`GET request to serve People Digitaly Authorised To File Online For This Company page`);
        // ...process request here and return data for the view
        this.viewData = this.getViewData();
        this.viewData.lang = getTranslationsForView(req.t, MANAGE_AUTHORISED_PEOPLE_LANG);
        const companyNumber: string = req.params[COMPANY_NUMBER];
        const companyAssociations: Associations = await getCompanyAssociations(companyNumber);
        this.viewData.companyAssociations = companyAssociations;
        const href = YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(`:${COMPANY_NUMBER}`, companyNumber);
        setExtraData(req.session, REFERER_URL, href);
        setExtraData(req.session, COMPANY_NAME, companyAssociations.items[0].companyName);
        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        return {
            backLinkHref: LANDING_URL,
            buttonHref: YOUR_COMPANIES_ADD_NEW_AUTHORISED_PERSON_URL,
            cancelUrl: YOUR_COMPANIES_CANCEL_PERSON_URL,
            resendEmailUrl: YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            removeUrl: YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL
        };
    }
}
