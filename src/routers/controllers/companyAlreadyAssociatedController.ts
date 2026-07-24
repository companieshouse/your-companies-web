import { CompanyAlreadyAssociatedHandler } from "../handlers/yourCompanies/companyAlreadyAssociatedHandler";
import * as constants from "../../constants";
import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const companyAlreadyAssociatedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyAlreadyAssociatedHandler();
    const viewData = await handler.execute(req);
    
    deleteExtraData(req.session, constants.COMPANY_ALREADY_ASSOCIATED_REASON);

    logger.info(createLogMessage(req, companyAlreadyAssociatedControllerGet.name, "Rendering company already associated stop screen"));
    res.render(constants.COMPANY_ALREADY_ASSOCIATED_STOP_SCREEN_PAGE, viewData);
};