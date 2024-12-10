import mocks from "../mocks/all.middleware.mock";
import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";
import supertest from "supertest";
import app from "../../src/app";
import { NextFunction, Request, Response } from "express";
import * as constants from "../../src/constants";
import { getFullUrl, getUrlWithCompanyNumber } from "../../src/lib/utils/urlUtils";

const router = supertest(app);
const companyNumber = "12345678";
const url = getUrlWithCompanyNumber(getFullUrl(constants.CREATE_COMPANY_ASSOCIATION_PATH), companyNumber);

describe("process.on", () => {

    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    it("catches uncaught exceptions", async () => {
        // Given
        mocks.mockCompanyAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            process.emit("uncaughtException", new Error("test error"));
            next();
        });
        const processExitMock = jest.spyOn(process, "exit").mockImplementation((number) => { throw new Error("process.exit: " + number); });
        // When
        await router.get(url);
        // Then
        expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it("catches unhandled rejection", async () => {
        // Given
        mocks.mockCompanyAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            const promise = new Promise<string>((resolve, reject) => {
                return reject;
            });
            process.emit("unhandledRejection", "reason", promise);
            next();
        });
        const processExitMock = jest.spyOn(process, "exit").mockImplementation((number) => { throw new Error("process.exit: " + number); });
        // When
        await router.get(url);
        // Then
        expect(processExitMock).toHaveBeenCalledWith(1);
    });
});
