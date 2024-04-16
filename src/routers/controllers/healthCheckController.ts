import { Request, Response, RequestHandler } from "express";
import logger from "../../lib/Logger";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const healthCheckController: RequestHandler = (
    req: Request,
    res: Response
) => {
    console.time("healthCheckController");
    logger.debug(`GET healthcheck`);
    res
        .status(StatusCodes.OK)
        .send(ReasonPhrases.OK);
    console.timeEnd("healthCheckController");

};
