import mocks from "../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../src/app";
import * as en from "../../src/locales/en/translation/service-unavailable.json";

const router = supertest(app);
const url = "/wrong-url";

describe("routerDispatch", () => {

    it("should not check session, company and user auth before returning the service unavailable page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).not.toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).not.toHaveBeenCalled();
    });

    it("should return status 404 and service unavailable page if wrong url provided", async () => {
        const result = await router.get(url);
        expect(result.status).toEqual(404);
        expect(result.text).toContain(en.try_again_later);
        expect(result.text).toContain(en.contact_companies_house);
        expect(result.text).toContain(en.if_you_have_questions);
    });
});
