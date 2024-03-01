import { User } from "../../../src/types/user";
import { getUserRecord } from "../../../src/services/userService";

describe("getUserRecord", () => {
    it("should return user with the provided user id", () => {
        // Given
        const userId = "1122334455";
        const expectedUser = {
            surname: "",
            email: "j.example@gmail.com",
            user_id: "1122334455",
            roles: ""
        } as User;

        // When
        const result = getUserRecord(userId);

        // Then
        expect(result).resolves.toEqual(expectedUser);
    });

    it("should return undefined if there is no user with the provided user id", () => {
        // Given
        const userId = "11111111111";

        // When
        const result = getUserRecord(userId);

        // Then
        expect(result).resolves.toBeUndefined();
    });
});
