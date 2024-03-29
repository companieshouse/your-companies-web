import { Request, Response } from "express";
import { CancelPersonHandler } from "../handlers/yourCompanies/cancelPersonHandler";
import {
    CANCEL_PERSON_PAGE,
    CONFIRMATION_CANCEL_PERSON_URL,
    GET,
    POST
} from "../../constants";

export const cancelPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CancelPersonHandler();
    const viewData = await handler.execute(req, res, GET);
    res.render(CANCEL_PERSON_PAGE, {
        ...viewData
    });
};

export const cancelPersonControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new CancelPersonHandler();
    const viewData = await handler.execute(req, res, POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(CANCEL_PERSON_PAGE, {
            ...viewData
        });
    } else {
        res.redirect(`${viewData.backLinkHref}${CONFIRMATION_CANCEL_PERSON_URL}`);
    }
};
