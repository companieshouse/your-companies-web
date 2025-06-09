import { Request, Response } from "express";
import {
    ConfirmationYourDigitalAuthorisationRestoredHandler
} from "../handlers/yourCompanies/confirmationYourDigitalAuthorisationRestoredHandler";
import * as constants from "../../constants";
import logger, { createLogMessage } from "../../lib/Logger";

export const confirmationYourDigitalAuthorisationRestoredControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await new ConfirmationYourDigitalAuthorisationRestoredHandler().execute(req);
    logger.info(
        createLogMessage(
            req.session,
            confirmationYourDigitalAuthorisationRestoredControllerGet.name,
            "Rendering restore your digital authorisation success page"
        ));
    res.render(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE, viewData);
};
