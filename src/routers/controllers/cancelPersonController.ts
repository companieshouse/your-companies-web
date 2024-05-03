import { Request, Response } from "express";
import { CancelPersonHandler } from "../handlers/yourCompanies/cancelPersonHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const cancelPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CancelPersonHandler();
    const viewData = await handler.execute(req, res, constants.GET);
    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    res.render(constants.CANCEL_PERSON_PAGE, {
        ...viewData
    });
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
