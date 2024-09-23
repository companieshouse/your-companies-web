import { Request, Response } from "express";
import { RemoveCompanyHandler } from "../handlers/removeCompanyHandler";
import * as constants from "../../constants";
import logger from "../../lib/Logger";

export const removeCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    try {
        const handler = new RemoveCompanyHandler();
        const viewData = await handler.execute(req, res, constants.GET);
        if (!viewData) {
            logger.error('Failed to load view data for GET request');
            return res.status(500).render('error-page', { message: 'Failed to load company removal page' });
        }
        res.render(constants.REMOVE_COMPANY_PAGE, { ...viewData });
    } catch (error) {
        logger.error(`Error in removeCompanyControllerGet: ${error}`);
        res.status(500).render('error-page', { message: 'Error loading company removal page' });
    }
};

export const removeCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const handler = new RemoveCompanyHandler();
        const viewData = await handler.execute(req, res, constants.POST);

        if (viewData) {
            if (viewData.errors && Object.keys(viewData.errors).length > 0) {
                // If there are errors (e.g., "Yes" or "No" was not selected), re-render the form with the errors
                return res.render(constants.REMOVE_COMPANY_PAGE, { ...viewData });
            }

            if (viewData.submissionSuccessful && !viewData.removalCancelled) {
                // If "Yes" was selected and the removal was successful, redirect to the confirmation page
                return res.redirect(constants.REMOVE_COMPANY_CONFIRMED_FULL_URL);
            }

            if (viewData.removalCancelled) {
                // If "No" was selected, redirect to the landing page
                return res.redirect(constants.LANDING_URL);
            }
        }

        // In case of an unexpected error, render an error page
        return res.status(500).render('error-page', { message: 'Failed to process company removal' });
    } catch (error) {
        // Catch any errors and log them, then render an error page
        console.error(`Error in removeCompanyControllerPost: ${error}`);
        return res.status(500).render('error-page', { message: 'Error processing company removal' });
    }
};

