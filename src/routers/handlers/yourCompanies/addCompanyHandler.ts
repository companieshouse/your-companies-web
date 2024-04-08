import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { StatusCodes } from "http-status-codes";
import { getLoggedInUserEmail, setExtraData, getExtraData } from "../../../lib/utils/sessionUtils";
import { isCompanyAssociatedWithUser } from "../../../services/associationsService";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { ViewData } from "../../../types/util-types";
import { validateClearForm } from "../../../lib/validation/generic";

export class AddCompanyHandler extends GenericHandler {

    async execute (req: Request, res: Response, method: string): Promise<ViewData> {
        logger.info(`${method} request to add company to user account`);
        // ...process request here and return data for the view
        try {
            this.viewData = this.getViewData();
            this.viewData.lang = getTranslationsForView(req.t, constants.ADD_COMPANY_PAGE);
            const clearForm = req.query.cf as string;
            if (validateClearForm(clearForm)) {
                setExtraData(req.session, constants.PROPOSED_COMPANY_NUM, undefined);
                setExtraData(req.session, constants.COMPANY_PROFILE, undefined);
            }
            if (method === constants.POST) {
                //  await this.handlePost(req);
                // save the proposed unvalidated company number for displaying in the input field
                if (typeof req.body.companyNumber === "string") {
                    console.log("saving", req.body.companyNumber);
                    setExtraData(req.session, constants.PROPOSED_COMPANY_NUM, req.body.companyNumber);
                    setExtraData(req.session, constants.COMPANY_PROFILE, undefined);
                    this.viewData.proposedCompanyNumber = req.body.companyNumber;
                } else {
                    console.log("IMPORTANT: THE DATE WAS NOT SAVED");
                }
                const payload = Object.assign({}, req.body);
                console.log("about to handle post ...");
                this.viewData.proposedCompanyNumber = payload.companyNumber;
                await this.validateCompanyNumber(req, payload.companyNumber);
            } else {
                const invalidCompanyNumber = getExtraData(req.session, constants.PROPOSED_COMPANY_NUM);
                const savedProfile = getExtraData(req.session, constants.COMPANY_PROFILE);
                // display any errors with the current input
                if (typeof invalidCompanyNumber === "string") {
                    console.log("the proposed invalid company num was a string -", invalidCompanyNumber);
                    this.viewData.proposedCompanyNumber = invalidCompanyNumber;
                    await this.validateCompanyNumber(req, invalidCompanyNumber);
                } else if (typeof savedProfile?.companyNumber === "string") {
                    console.log("there was no proposed num but there was a valid profile");
                    this.viewData.proposedCompanyNumber = savedProfile.companyNumber;
                    await this.validateCompanyNumber(req, savedProfile?.companyNumber);
                }
            }
        } catch (err: any) {
            if (err.httpStatusCode === StatusCodes.NOT_FOUND ||
                err.httpStatusCode === StatusCodes.BAD_REQUEST ||
                err.httpStatusCode === StatusCodes.FORBIDDEN) {
                this.viewData.errors = {
                    companyNumber: {
                        text: constants.ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG
                    }
                };
            } else {
                logger.error(`Error adding a company to user account: ${err}`);
                this.viewData.errors = this.processHandlerException(err);
            }
        }
        return Promise.resolve(this.viewData);
    }

    private async validateCompanyNumber (req: Request, companyNumber:string) {
        // const payload = Object.assign({}, req.body);
        if (!companyNumber) {
            console.log("there was no company number");
            this.viewData.errors = {
                companyNumber: {
                    text: constants.ENTER_A_COMPANY_NUMBER
                }
            };
        } else {
            const companyProfile: CompanyProfile = await getCompanyProfile(companyNumber);
            if (companyProfile.companyStatus.toLocaleLowerCase() !== constants.COMPANY_STATUS_ACTIVE) {
                this.viewData.errors = {
                    companyNumber: {
                        text: constants.ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE
                    }
                };
            } else {
                await this.handleActiveCompany(req, companyProfile);
            }
        }
    }

    private async handleActiveCompany (req: Request, companyProfile: CompanyProfile) {
        setExtraData(req.session, constants.COMPANY_PROFILE, companyProfile);
        setExtraData(req.session, constants.COMPANY_NUMBER, companyProfile.companyNumber);
        setExtraData(req.session, constants.PROPOSED_COMPANY_NUM, undefined);

        const userEmailAddress = getLoggedInUserEmail(req.session);
        const isAssociated: string = await isCompanyAssociatedWithUser(req, companyProfile.companyNumber, userEmailAddress);
        if (isAssociated === constants.COMPNANY_ASSOCIATED_WITH_USER) {
            this.viewData.errors = {
                companyNumber: {
                    text: constants.THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT
                }
            };
        } else {
            setExtraData(req.session, constants.COMPANY_PROFILE, companyProfile);
        }
    }

    private getViewData (): ViewData {
        return {
            backLinkHref: constants.LANDING_URL
        } as ViewData;
    }
}
