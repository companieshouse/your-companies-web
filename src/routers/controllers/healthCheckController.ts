import { Request, Response, RequestHandler } from "express";
import logger from "../../lib/Logger";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

/**
 * Controller for handling health check requests.
 * Responds with HTTP 200 OK status and a corresponding message.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const healthCheckController: RequestHandler = (req: Request, res: Response) => {
    logger.debug("GET healthcheck");
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};
