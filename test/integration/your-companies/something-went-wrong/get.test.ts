import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../src/constants";
import en from "../../../../locales/en/service-unavailable.json";
import cy from "../../../../locales/cy/service-unavailable.json";

const router = supertest(app);

jest.mock("../../../../src/lib/Logger");

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
        { status: 403, langInfo: "English", langVersion: "en", condition: "CSRF error", lang: en, csrfError: true },
        { status: 403, langInfo: "English", langVersion: undefined, condition: "CSRF error", lang: en, csrfError: true },
        { status: 403, langInfo: "Welsh", langVersion: "cy", condition: "CSRF error", lang: cy, csrfError: true },
        { status: 500, langInfo: "English", langVersion: "en", condition: "it is not a CSRF error", lang: en, csrfError: false },
        { status: 500, langInfo: "English", langVersion: undefined, condition: "it is not a CSRF error", lang: en, csrfError: false },
        { status: 500, langInfo: "Welsh", langVersion: "cy", condition: "it is not a CSRF error", lang: cy, csrfError: false }
    ])("should return status %s and %s content if language set to %s",
        async ({ status, langVersion, lang, csrfError }) => {

            // Given
            const csrfErrorString = csrfError ? `${constants.CSRF_ERRORS}` : "";
            const langString = langVersion ? `lang=${langVersion}` : "";
            let queryString = "";
            if (langVersion && csrfError) {
                queryString = `?${langString}&${csrfErrorString}`;
            } else if (langVersion || csrfError) {
                queryString = langVersion ? `?${langString}` : `?${csrfErrorString}`;
            }
            // When
            const result = await router.get(`${url}${queryString}`);
            // Then
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(result.status).toEqual(status);
            if (status === 403) {
                expect(result.text).toContain(lang.sorry_something_went_wrong);
                expect(result.text).toContain(lang.we_have_not_been_able_to_save);
                expect(result.text).toContain(lang.try_the_following);
                expect(result.text).toContain(lang.use_the_back_link);
                expect(result.text).toContain(lang.sign_out_of_the_service);
                expect(result.text).toContain(lang.if_the_problem_continues);
                expect(result.text).toContain(lang.contact_us_link);
                expect(result.text).toContain(lang.for_help);
            } else {
                expect(result.text).toContain(lang.page_header);
                expect(result.text).toContain(lang.try_again_later);
                expect(result.text).toContain(lang.contact_companies_house);
                expect(result.text).toContain(lang.if_you_have_questions);
            }
        });
});
