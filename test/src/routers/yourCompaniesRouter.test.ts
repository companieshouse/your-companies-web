import app from "../../../src/app";
import supertest from "supertest";
const router = supertest(app);

describe("GET /your-companies", () => {
    it("should return status 200", async () => {
        await router.get("/your-companies").expect(200);
    });
});
