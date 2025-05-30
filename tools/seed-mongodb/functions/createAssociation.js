import { faker } from "@faker-js/faker";

export function createAssociation (user, users, company) {

    const firstUser = users[0];
    const association = {
        _id: faker.string.uuid().replace(/-/g, "").toUpperCase(),
        company_number: company._id,
        user_id: user._id,
        status: statusOfAssociation(),
        etag: faker.string.uuid(),
        version: 0,
        _class: "uk.gov.companieshouse.accounts.association.models.Association"
    };

    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 14);
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 14);
    const randomInviteDate = faker.date.between({ from: pastDate, to: futureDate });
    association.created_at = randomInviteDate;

    const approvalExpiryDate = new Date(randomInviteDate);
    approvalExpiryDate.setDate(randomInviteDate.getDate() + 7);
    association.approval_expiry_at = approvalExpiryDate;

    const approvedAtDate = new Date(randomInviteDate);
    approvedAtDate.setDate(randomInviteDate.getDate() + 2);
    association.approved_at = approvedAtDate;

    const removedAtDate = new Date(randomInviteDate);
    removedAtDate.setDate(randomInviteDate.getDate() + 4);
    association.removed_at = removedAtDate;

    const approvalRouteOptions = ["auth_code", "invitation"];
    association.approval_route = approvalRouteOptions[Math.floor(Math.random() * 2)];

    const invitations = association.approval_route === "auth_code" ? [] : [{ invited_by: firstUser._id, invited_at: randomInviteDate }];
    association.invitations = invitations;

    if (Math.random() > 0.4) {
        const previousStates = [];
        const numberOfPreviousStates = Math.floor(Math.random() * 101);
        for (let index = 0; index < numberOfPreviousStates; index++) {
            const previousState = {
                status: statusOfAssociation(),
                changed_by: users[Math.floor(Math.random() * users.length)]._id,
                changed_at: faker.date.between({ from: pastDate, to: futureDate })
            };
            previousStates.push(previousState);
        }
        association.previous_states = previousStates;
    }

    return association;
}

function statusOfAssociation () {
    const random = Math.random();
    if (random < 0.5) {
        return "confirmed";
    } else if (random < 0.9) {
        return "awaiting-approval";
    } else {
        return "removed";
    }
}

// This wil create an association for a single user
