import { Request, Response, NextFunction } from "express";
import { CancelPersonHandler } from "../handlers/yourCompanies/cancelPersonHandler";
import {
    CANCEL_PERSON_TEMPLATE,
    CONFIRMATION_CANCEL_PERSON_URL,
    GET,
    POST
} from "../../constants";

export const cancelPersonControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new CancelPersonHandler();
    const viewData = await handler.execute(req, res, GET);
    res.render(CANCEL_PERSON_TEMPLATE, {
        ...viewData
    });
};

export const cancelPersonControllerPost = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new CancelPersonHandler();
    const viewData = await handler.execute(req, res, POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(CANCEL_PERSON_TEMPLATE, {
            ...viewData
        });
    } else {
        res.redirect(`${viewData.backLinkHref}${CONFIRMATION_CANCEL_PERSON_URL}`);
    }
};
