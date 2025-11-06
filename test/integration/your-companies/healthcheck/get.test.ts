import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";

const router = supertest(app);
const url = "/your-companies/healthcheck";
jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com")
    };
});

describe("GET /your-companies/healthcheck", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check user auth before returning the response and return status 200",
       async () => {
           // When
           const response = await router.get(url);
           // Then
           expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
           expect(response.status).toEqual(200);
           expect(response.text).toContain("OK");
       });
});
