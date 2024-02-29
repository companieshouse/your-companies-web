import { Request, Response } from "express";

export const companyInvitationsDeclineController = async (
    req: Request,
    res: Response
) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`<h1>Decline Invite</h1>`);
};
