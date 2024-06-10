import { Request, Response } from "express";
import { ManageAuthorisedPeopleHandler } from "../handlers/yourCompanies/manageAuthorisedPeopleHandler";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../lib/utils/sessionUtils";

export const manageAuthorisedPeopleControllerGet = async (req: Request, res: Response): Promise<void> => {

    const handler = new ManageAuthorisedPeopleHandler();
    const viewData = await handler.execute(req);
    const managedAuthorisedPeopleIndicator = true;

    if (getExtraData(req.session, constants.CANCEL_URL_EXTRA)) {
        deleteExtraData(req.session, constants.CANCEL_URL_EXTRA);
    }
    if (getExtraData(req.session, constants.REMOVE_URL_EXTRA)) {
        deleteExtraData(req.session, constants.REMOVE_URL_EXTRA);
    }
    setExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, managedAuthorisedPeopleIndicator);

    res.render(constants.MANAGE_AUTHORISED_PEOPLE_PAGE, {
        ...viewData
    });
};
