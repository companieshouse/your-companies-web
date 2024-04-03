import { Request, Response } from "express";
import { CancelPersonHandler } from "../handlers/yourCompanies/cancelPersonHandler";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const cancelPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const referrer :string|undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const userEmail = req.params[constants.USER_EMAIL];

    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    if (redirectPage(referrer, hrefA, constants.CANCEL_PERSON_URL.replace(":userEmail", userEmail), pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        const handler = new CancelPersonHandler();
        const viewData = await handler.execute(req, res, constants.GET);
        res.render(constants.CANCEL_PERSON_PAGE, {
            ...viewData
        });
    }
};

export const cancelPersonControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new CancelPersonHandler();
    const viewData = await handler.execute(req, res, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.CANCEL_PERSON_PAGE, {
            ...viewData
        });
    } else {
        res.redirect(`${viewData.backLinkHref}${constants.CONFIRMATION_CANCEL_PERSON_URL}`);
    }
};
