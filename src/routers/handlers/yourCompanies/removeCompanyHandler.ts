import { Request, Response } from "express";
import { GenericHandler } from "../../handlers/genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import logger from "../../../lib/Logger";
import { isOrWasCompanyAssociatedWithUser, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { AssociationState } from "../../../types/associations";
import { getFullUrl } from "../../../lib/utils/urlUtils";

interface RemoveCompanyViewData extends ViewDataWithBackLink, CompanyNameAndNumber { }

export class RemoveCompanyHandler extends GenericHandler {
    viewData: RemoveCompanyViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVE_COMPANY_PAGE,
            backLinkHref: constants.LANDING_URL,
            lang: {},
            companyName: "",
            companyNumber: ""
        };
    }

    async execute (req: Request, res: Response, method: string): Promise<RemoveCompanyViewData | void> {
        const companyNumber = req.params[constants.COMPANY_NUMBER];
        this.viewData.companyNumber = companyNumber;
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_COMPANY_PAGE);

        if (method === constants.GET) {
            const error = getExtraData(req.session, constants.YOU_MUST_SELECT_AN_OPTION
            );

            try {
                const companyProfile = await getCompanyProfile(companyNumber);
                setExtraData(req.session, constants.COMPANY_NAME, companyProfile.companyName);
                this.viewData.companyName = companyProfile.companyName;
            } catch (err) {
                logger.error(`Error fetching company profile for ${companyNumber}: ${err}`);
            }

            if (error) {
                this.viewData.errors = {
                    confirmRemoval: {
                        text: "you_must_select_an_option"
                    }
                };
            }

            return this.viewData;
        } else if (method === constants.POST) {
            this.viewData.companyName = getExtraData(req.session, constants.COMPANY_NAME);
            const selectedOption = req.body.confirmRemoval;

            if (!selectedOption) {
                this.viewData.errors = {
                    confirmRemoval: {
                        text: "you_must_select_an_option"
                    }
                };
                setExtraData(req.session, constants.YOU_MUST_SELECT_AN_OPTION, this.viewData.errors);
                return this.viewData;
            } else {
                deleteExtraData(req.session, constants.YOU_MUST_SELECT_AN_OPTION);
                if (selectedOption === "yes") {
                    // The redirect is handled in handleCompanyRemoval
                    return this.handleCompanyRemoval(req, res);
                } else if (selectedOption === "no") {
                    return res.redirect(constants.LANDING_URL);
                }
            }
        }
    }

    private async handleCompanyRemoval (req: Request, res: Response): Promise<RemoveCompanyViewData | void> {
        const companyNumber = req.params[constants.COMPANY_NUMBER];
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);

        const associationState = await isOrWasCompanyAssociatedWithUser(req, companyNumber);

        if (associationState.state !== AssociationState.COMPANY_ASSOCIATED_WITH_USER) {
            return this.renderErrorPage(res, `Cannot remove company ${companyNumber} as it is not associated with the user`);
        }

        const removalResult = await removeUserFromCompanyAssociations(req, associationState.associationId);

        if (removalResult !== constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS) {
            return this.renderErrorPage(res, `Unexpected result when removing company ${companyNumber}: ${removalResult}`);
        }

        setExtraData(req.session, constants.COMPANY_STATUS_INACTIVE, true);
        setExtraData(req.session, constants.LAST_REMOVED_COMPANY_NAME, companyName);
        setExtraData(req.session, constants.LAST_REMOVED_COMPANY_NUMBER, companyNumber);

        res.redirect(getFullUrl(constants.REMOVE_COMPANY_CONFIRMED_URL));
    }

    private renderErrorPage (res: Response, errorMessage: string): RemoveCompanyViewData {
        logger.error(errorMessage);
        this.viewData.errors = {
            generic: {
                text: "error_removing_company"
            }
        };
        return this.viewData;
    }
}
