import { Request, Response } from "express";

export const companyInvitationsAcceptController = async (
    req: Request,
    res: Response
) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`<h1>Accept Invite</h1>`);
};
