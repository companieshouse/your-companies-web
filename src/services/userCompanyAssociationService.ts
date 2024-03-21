import { Associations, AssociationStatus } from "../types/associations";
import {
    CONFIRM,
    YES
} from "../constants";
import { Cancellation } from "../types/cancellation";
import { Removal } from "types/removal";

export const polishBrewItems = {
    items: [
        {
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "awaiting-approval"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "john.smith@test.com",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Confirmed"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "eva.brown@company.com",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "awaiting-approval"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "mark.black@private.com",
            displayName: "Mark Black",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Confirmed"
        }
    ]
} as Associations;

export const britishAirwaysItems = {
    items: [
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "john.smith@test.com",
            displayName: "John Smith",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: "Confirmed"
        }
    ]
} as Associations;

export const isEmailAuthorised = async (email: string, companyNumber: string): Promise<boolean> => {
    const companyAssociations: Associations = await getCompanyAssociations(companyNumber, undefined);
    return companyAssociations.items.some(item => item.userEmail.toLowerCase() === email.toLowerCase() && item.status.toLowerCase() === AssociationStatus.CONFIRMED);
};

export const addUserEmailAssociation = async (email: string, companyNumber: string): Promise<void> => {
    if (!email) return;
    if (companyNumber === "NI038379") {
        const isAssociated = await isEmailAuthorised(email, companyNumber);
        if (!isAssociated) {
            polishBrewItems.items.push(
                {
                    id: "",
                    userId: "",
                    userEmail: email,
                    companyNumber: "NI038379",
                    companyName: "THE POLISH BREWERY",
                    status: "awaiting-approval",
                    displayName: ""
                }
            );
        }
    }
    if (companyNumber === "01777777") {
        const isAssociated = await isEmailAuthorised(email, companyNumber);
        if (!isAssociated) {
            britishAirwaysItems.items.push(
                {
                    id: "",
                    userId: "",
                    userEmail: email,
                    displayName: "",
                    companyNumber: "01777777",
                    companyName: "BRITISH AIRWAYS PLC",
                    status: "awaiting-approval"
                }
            );
        }
    }
};
export const getCompanyAssociations = async (companyNumber: string, cancellationOrRemoval: Cancellation | Removal | undefined): Promise<Associations> => {
    // We will replace this hard coded value with the API call once the API is available

    if (cancellationOrRemoval && "cancelPerson" in cancellationOrRemoval) {
        return getCompanyAssociationsAfterCancellation(companyNumber, cancellationOrRemoval);
    } else {
        return getCompanyAssociationsAfterRemoval(companyNumber, cancellationOrRemoval);
    }
};

const getCompanyAssociationsAfterCancellation = (companyNumber: string, cancellation: Cancellation | undefined): Promise<Associations> => {
    const associations: Associations = companyNumber === "NI038379" ? polishBrewItems : britishAirwaysItems;

    if (cancellation && cancellation.cancelPerson === YES) {
        associations.items = associations.items.filter(user => user.userEmail !== cancellation.userEmail);
    }
    return Promise.resolve(associations);
};
const getCompanyAssociationsAfterRemoval = (companyNumber: string, removal: Removal | undefined): Promise<Associations> => {
    const associations: Associations = companyNumber === "NI038379" ? polishBrewItems : britishAirwaysItems;

    if (removal && removal.removePerson === CONFIRM) {
        associations.items = associations.items.filter(user => user.userEmail !== removal.userEmail);
    }
    return Promise.resolve(associations);
};
