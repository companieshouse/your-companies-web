import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../src/constants";

const router = supertest(app);
const companyNumber = "12345678";
const url = constants.YOUR_COMPANIES_AUTHORISED_PRESENTER_ALREADY_ADDED_URL.replace(constants.COMPANY_NUMBER, companyNumber);

describe("presenterAlreadyAddedControllerGet", () => {

    it("should check session, company and user auth before routing to controller", async () => {
        await router.post(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 302", async () => {
        const response = await router.get(url);
        expect(response.status).toEqual(302);
    });
});
