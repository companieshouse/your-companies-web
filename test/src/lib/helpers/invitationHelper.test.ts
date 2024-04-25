import { getNewestInvite } from "../../../../src/lib/helpers/invitationHelper";
import { Invitation } from "../../../../src/types/associations";

describe("getNewestInvite", () => {
    it("should return the most recent invitation", () => {
        // Given
        const inviteNew:Invitation = { invitedBy: "11", invitedAt: "2024-04-08T17:27:19.539917" };
        const inviteOld:Invitation = { invitedBy: "22", invitedAt: "2024-03-15T17:23:40.225089" };

        const invitationsArray:Invitation[] = [inviteNew, inviteOld];
        // When
        const result = getNewestInvite(invitationsArray);
        // Then
        expect(result).toEqual(inviteNew);
    });
    it("should return the most recent invitation", () => {
        // Given
        const invite1:Invitation = { invitedBy: "1", invitedAt: "2024-04-08T17:27:19.539917" };
        const invite2:Invitation = { invitedBy: "2", invitedAt: "2024-03-15T17:23:40.225089" };
        const invite3:Invitation = { invitedBy: "3", invitedAt: "2024-01-15T17:23:40.225089" };
        const invite4:Invitation = { invitedBy: "4", invitedAt: "2024-04-22T17:23:40.225089" };
        const invite5:Invitation = { invitedBy: "5", invitedAt: "2024-04-15T17:23:40.225089" };

        const invitationsArray:Invitation[] = [invite1, invite2, invite3, invite4, invite5];
        // When
        const result = getNewestInvite(invitationsArray);
        // Then
        expect(result).toEqual(invite4);
    });
    it("should return the only invitation", () => {
        // Given
        const singleInvite:Invitation = { invitedBy: "1", invitedAt: "2024-04-08T17:27:19.539917" };

        const invitationsArray:Invitation[] = [singleInvite];
        // When
        const result = getNewestInvite(invitationsArray);
        // Then
        expect(result).toEqual(singleInvite);
    });
});
