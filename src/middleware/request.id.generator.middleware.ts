import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestIdGenerator = (req: Request, res: Response, next: NextFunction): void => {

    req.requestId = uuidv4();
    res.setHeader("X-Request-Id", req.requestId);
    next();

};
