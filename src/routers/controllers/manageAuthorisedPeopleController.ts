import { Request, Response } from "express";
import { ManageAuthorisedPeopleHandler } from "../handlers/yourCompanies/manageAuthorisedPeopleHandler";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const manageAuthorisedPeopleControllerGet = async (req: Request, res: Response): Promise<void> => {

    const referrer :string|undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);

    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    if (req.originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL) && redirectPage(referrer, hrefA, constants.CONFIRMATION_CANCEL_PERSON_URL, pageIndicator)) {
        res.redirect(constants.LANDING_URL);

    } else if (req.originalUrl.includes(constants.CONFIRMATION_PERSON_REMOVED_URL) && redirectPage(referrer, hrefA, constants.CONFIRMATION_PERSON_REMOVED_URL, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else if (req.originalUrl.includes(constants.CONFIRMATION_PERSON_ADDED) && redirectPage(referrer, hrefA, constants.CONFIRMATION_PERSON_REMOVED_URL, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {

        const handler = new ManageAuthorisedPeopleHandler();
        const viewData = await handler.execute(req);
        const managedAuthorisedPeopleIndicator = true;
        setExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, managedAuthorisedPeopleIndicator);
        res.render(constants.MANAGE_AUTHORISED_PEOPLE_PAGE, {
            ...viewData
        });

    }

};
