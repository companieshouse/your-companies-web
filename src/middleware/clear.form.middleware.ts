import { NextFunction, Request, Response } from "express";
import * as constants from "../constants";
import { setExtraData } from "../lib/utils/sessionUtils";

export const clearFormValues = (req: Request, res: Response, next: NextFunction):void => {

    const callerUrl = req.headers.referer;
    console.log("caller url is ", callerUrl);
    const callerUrlPathArray = callerUrl?.split("/");
    let fromYourCompanies = false;

    if (callerUrlPathArray?.length) {
        const path = "/" + callerUrlPathArray[callerUrlPathArray.length - 1];
        fromYourCompanies = path === constants.LANDING_URL;
    }
    console.log("from your companies is ", fromYourCompanies);
    if (fromYourCompanies) {
        console.log("now clearing form values ", fromYourCompanies);
        setExtraData(req.session, constants.COMPANY_PROFILE, undefined);
        setExtraData(req.session, constants.PROPOSED_COMPANY_NUM, undefined);
    }
    return next();
};
