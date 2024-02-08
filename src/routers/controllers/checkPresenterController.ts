import { Request, Response, NextFunction } from "express";
import { pages, BASE_URL } from "../../constants";

export const checkPresenterControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const viewData = {};
    res.render(pages.CHECK_PRESENTER, viewData);
};

export const checkPresenterControllerPost = async (req: Request, res: Response, next: NextFunction) => {

    const viewData = { errors: "abc" };
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(pages.CHECK_PRESENTER, viewData);
    } else {
        res.redirect(BASE_URL + pages.EMAIL_ADDED);
    }
};
