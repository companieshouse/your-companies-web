import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import {
    YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL,
    TRUE,
    YOUR_COMPANIES_ADD_COMPANY_URL,
    YOUR_COMPANIES_PAGE
} from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { Associations } from "../../../types/associations";
import { getUserAssociations } from "../../../services/userCompanyAssociationService";
import { getLoggedInUserEmail } from "../../../lib/utils/sessionUtils";

export class YourCompaniesHandler extends GenericHandler {

    async execute (req: Request, response: Response): Promise<Record<string, any>> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        const userEmailAddress = getLoggedInUserEmail(req.session);
        const userAssociations: Associations = await getUserAssociations(userEmailAddress);
        this.viewData = this.getViewData(userAssociations);
        this.viewData.lang = getTranslationsForView(req.t, YOUR_COMPANIES_PAGE);
        return Promise.resolve(this.viewData);
    }

    private getViewData (userAssociations: Associations): any {
        const viewData: Record<string, any> = {
            buttonHref: YOUR_COMPANIES_ADD_COMPANY_URL
        };

        const confirmedAssociations = userAssociations?.items
            ?.filter(item => item.status === "confirmed");

        if (confirmedAssociations?.length) {
            // viewData.associationData = confirmedAssociations.map(item =>
            //     [{ text: item.companyName }, { text: item.companyNumber }]); ;
            viewData.userHasCompanies = TRUE;
            viewData.viewAndManageUrl = YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL;
        }
        return viewData;
    }
}
