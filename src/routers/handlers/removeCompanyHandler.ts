import { Request, Response } from "express";
import { GenericHandler } from "../handlers/genericHandler";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { ViewData } from "../../types/util-types";
import logger from "../../lib/Logger";
import { isOrWasCompanyAssociatedWithUser, removeUserFromCompanyAssociations } from "../../services/associationsService";
import { getCompanyProfile } from "../../services/companyProfileService";

export class RemoveCompanyHandler extends GenericHandler {
    async execute (req: Request, res: Response, method: string): Promise<ViewData | void> {
        if (method === constants.GET) {
            deleteExtraData(req.session, constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
            const companyNumber = req.params[constants.COMPANY_NUMBER];
            try {
                const companyProfile = await getCompanyProfile(companyNumber);
                setExtraData(req.session, constants.COMPANY_NAME, companyProfile.companyName);
            } catch (error) {
                logger.error(`Error fetching company profile for ${companyNumber}: ${error}`);
            }
            this.viewData = await this.getViewData(req);
            return this.viewData;
        } else if (method === constants.POST) {
            this.viewData = await this.getViewData(req);
            const selectedOption = req.body.confirmRemoval;

            if (!selectedOption) {
                this.viewData.errors = {
                    confirmRemoval: {
                        text: 'you_must_select_an_option'
                    }
                };
                return this.viewData;
            } else {
                if (selectedOption === 'yes') {
                    await this.handleCompanyRemoval(req, res);
                    return; // The redirect is handled in handleCompanyRemoval
                } else if (selectedOption === 'no') {
                    this.viewData.submissionSuccessful = true;
                    this.viewData.removalCancelled = true;
                    return this.viewData;
                }
            }
        }
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const lang = getTranslationsForView((req as any).lang, constants.REMOVE_COMPANY_PAGE);
        return {
            templateName: constants.REMOVE_COMPANY_PAGE,
            lang: lang,
            companyNumber: req.params[constants.COMPANY_NUMBER],
            companyName: getExtraData(req.session, constants.COMPANY_NAME),
            backLinkHref: constants.LANDING_URL
        }
    }

    private async handleCompanyRemoval (req: Request, res: Response): Promise<void> {
        const companyNumber = req.params[constants.COMPANY_NUMBER];
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);

        try {
            const associationState = await isOrWasCompanyAssociatedWithUser(req, companyNumber);

            if (associationState.state === associationState.associationId) {
                const removalResult = await removeUserFromCompanyAssociations(req, associationState.associationId);

                if (removalResult === constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS) {
                    setExtraData(req.session, constants.COMPANY_STATUS_INACTIVE, true);
                    setExtraData(req.session, constants.LAST_REMOVED_COMPANY_NAME, companyName);
                    setExtraData(req.session, constants.LAST_REMOVED_COMPANY_NUMBER, companyNumber);

                    // Redirect to the confirmation page
                    res.redirect(constants.REMOVE_COMPANY_CONFIRMED_FULL_URL);
                } else {
                    logger.error(`Unexpected result when removing company ${companyNumber}: ${removalResult}`);
                    throw new Error('Unexpected result from company removal');
                }
            } else {
                logger.error(`Cannot remove company ${companyNumber} as it is not associated with the user`);
                throw new Error('Company not associated with user');
            }
        } catch (error) {
            logger.error(`Error removing company ${companyNumber}: ${error}`);
            this.viewData.errors = {
                generic: {
                    text: 'error_removing_company'
                }
            };
            res.render(constants.REMOVE_COMPANY_PAGE, this.viewData);
        }
    }
}
