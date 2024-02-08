import { Request, Response, NextFunction } from "express";
import { pages, BASE_URL } from "../../constants";
import { getTranslationsForView } from "../../lib/utils/translations";

export const addPresenterControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const viewData = {
        lang: getTranslationsForView(req.t, pages.ADD_PRESENTER)
    };

    res.render(pages.ADD_PRESENTER, viewData);
};

export const addPresenterControllerPost = async (req: Request, res: Response, next: NextFunction) => {

    const viewData = { errors: "abc" };
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(pages.ADD_PRESENTER, viewData);
    } else {
        res.redirect(BASE_URL + pages.CHECK_PRESENTER);
    }
};
