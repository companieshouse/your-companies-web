import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

export const requestIdGenerator = (req: Request, res: Response, next: NextFunction): void => {

    req.requestId = randomUUID().replace(/-/g, "");
    res.setHeader("X-Request-Id", req.requestId);
    next();

};
