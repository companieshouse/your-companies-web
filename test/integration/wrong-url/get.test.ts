import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import en from "../../../locales/en/service-unavailable.json";
import cy from "../../../locales/cy/service-unavailable.json";

const router = supertest(app);
const url = "/wrong-url";

jest.mock("../../../src/lib/Logger");

describe("GET /wrong-url", () => {

    it("should not check session, company and user auth before returning the service unavailable page", async () => {
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).not.toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).not.toHaveBeenCalled();
    });

    test.each([
        { langVersion: "en", lang: en },
        { langVersion: undefined, lang: en },
        { langVersion: "cy", lang: cy }
    ])("should return status 404 and service unavailable page if wrong url provided and lang set to '$langVersion'",
        async ({ langVersion, lang }) => {
            // When
            const result = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(result.status).toEqual(404);
            expect(result.text).toContain(lang.try_again_later);
            expect(result.text).toContain(lang.contact_companies_house);
            expect(result.text).toContain(lang.if_you_have_questions);
        });
});
