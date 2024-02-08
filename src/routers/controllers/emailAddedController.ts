import { Request, Response, NextFunction } from "express";
import { pages } from "../../constants";

export const emailAddedControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const viewData = {};
    res.render(pages.EMAIL_ADDED, viewData);
};
