import { Request, Response, NextFunction } from "express";
import { CancelPersonHandler } from "../handlers/yourCompanies/cancelPersonHandler";
import {
    CANCEL_PERSON,
    CANCEL_PERSON_TEMPLATE,
    GET,
    POST,
    USER_EMAIL,
    YES,
    YOUR_COMPANIES_CONFIRMATION_CANCEL_PERSON_URL
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
        const url = req.session?.getExtraData(CANCEL_PERSON) === YES
            ? YOUR_COMPANIES_CONFIRMATION_CANCEL_PERSON_URL.replace(`:${USER_EMAIL}`, req.params[USER_EMAIL])
            : viewData.backLinkHref;
        res.redirect(url);
    }
};
