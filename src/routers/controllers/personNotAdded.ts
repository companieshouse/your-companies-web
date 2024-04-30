import { ERROR_400_TEMPLATE } from "../../constants";
import { Request, RequestHandler, Response } from "express";

export const personNotAddedControllerGet: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    res.status(400).render(ERROR_400_TEMPLATE);
};
