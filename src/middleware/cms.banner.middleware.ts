import { NextFunction, Request, Response } from "express";
import { getBannerContentApiResponse } from "../services/apiClientMock";
/**
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */

export const createCmsBannerMiddleare = (bannerId: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await getBannerContentApiResponse(bannerId);

            if (data.active){
                const cmsBannerData = {
                    ...data,
                    message: data.message[req.lang],
                    title: data.title[req.lang],
                    linkText: data.linkText[req.lang]
                };
                res.locals.cmsBanner = cmsBannerData;
                res.locals.bannerActice = true;
            } else {
                res.locals.bannerActice = false;
            }
            next();
        } catch (e){
            res.locals.cmsBanner = null;
            res.locals.bannerActive = false;
            console.log('error with CMS api request', e);
            next();

        }
    };
};
