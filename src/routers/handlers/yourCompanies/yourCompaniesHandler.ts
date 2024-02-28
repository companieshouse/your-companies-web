import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { Associations } from "../../../types/associations";
import { getUserAssociations } from "../../../services/userCompanyAssociationService";
import { getLoggedInUserEmail, setExtraData } from "../../../lib/utils/sessionUtils";

export class YourCompaniesHandler extends GenericHandler {

    async execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        const userEmailAddress = getLoggedInUserEmail(req.session);
        const userAssociations: Associations = await getUserAssociations(userEmailAddress);
        setExtraData(req.session, constants.USER_ASSOCIATIONS, userAssociations);
        this.viewData = this.getViewData(userAssociations);
        this.viewData.lang = getTranslationsForView(req.t, constants.YOUR_COMPANIES_PAGE);
        return Promise.resolve(this.viewData);
    }

    private getViewData (userAssociations: Associations): any {
        const viewData: Record<string, any> = {
            buttonHref: constants.YOUR_COMPANIES_ADD_COMPANY_URL
        };

        if (userAssociations?.items?.length > 0) {
            const associationData: { text: string}[][] = [];
            for (let index = 0; index < userAssociations.items.length; index++) {
                associationData[index] = [
                    {
                        text: userAssociations.items[index].companyName
                    },
                    {
                        text: userAssociations.items[index].companyNumber
                    }
                ];
            }

            viewData.associationData = associationData;
            viewData.userHasCompanies = constants.TRUE;
            viewData.viewAndManageUrl = constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL;
            viewData.numberOfInvitations = userAssociations.totalResults;
            viewData.viewInvitationsPageUrl = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL;
        }
        return viewData;
    }
}
