import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as en from "../../../../locales/en/service-unavailable.json";
import * as cy from "../../../../locales/cy/service-unavailable.json";

const router = supertest(app);

describe("GET /your-companies/something-went-wrong", () => {
    const url = `/your-companies/something-went-wrong`;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the something went wrong page", async () => {
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        [403, "English", "default", en],
        [403, "English", "en", en],
        [403, "Welsh", "cy", cy]
    ])("should return status %s and %s content if language set to %s",
        async (status, _langVersionInfo, langVersion, lang) => {
            // Given
            const langParam = langVersion === "default" ? "" : `?lang=${langVersion}`;
            // When
            const result = await router.get(`${url}${langParam}`);
            // Then
            expect(result.status).toEqual(status);
            expect(result.text).toContain(lang.sorry_something_went_wrong);
            expect(result.text).toContain(lang.we_have_not_been_able_to_save);
            expect(result.text).toContain(lang.try_the_following);
            expect(result.text).toContain(lang.use_the_back_link);
            expect(result.text).toContain(lang.sign_out_of_the_service);
            expect(result.text).toContain(lang.if_the_problem_continues);
            expect(result.text).toContain(lang.contact_us_link);
            expect(result.text).toContain(lang.for_help);
        });
});
