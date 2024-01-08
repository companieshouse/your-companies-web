import { Request, Response } from "express";
import { GenericHandler } from "./generic";
import logger from "../../lib/Logger";

const translationsForView = (req: Request, viewName: string) => ({
    ...req.t("common", { returnObjects: true }),
    ...req.t(viewName, { returnObjects: true })
});

export class ConfirmCorrectCompany extends GenericHandler {

    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve the confirm correct company page`);
        this.viewData = this.getViewData(req, response);
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request, response: Response): any {
        return {
            ...translationsForView(req, "confirm-company-details"),
            backLinkUrl: "/your-companies/add-a-company",
            companyName: "FLOWERS 11 LIMITED",
            companyNumber: "18882777 ",
            companyStatus: "Active",
            incorporationDate: "11 December 2006",
            companyType: "Private Limited Company",
            registeredOfficeAddress: "2nd Floor Red House <br/>17 London Road <br/> London <br /> SA73 8PH"
        };
    }
};
