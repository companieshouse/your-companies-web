import { User } from "../../src/types/user";

jest.mock("../../src/services/userService");

export const userRecords: User[] = [{
    surname: "",
    email: "hannah.salt@gmail.com",
    userId: "76896789",
    roles: ""
},
{
    surname: "",
    email: "james-morris@accounting.com",
    userId: "5544332211",
    roles: ""
},
{
    surname: "",
    email: "j.example@gmail.com",
    userId: "1122334455",
    roles: ""
},
{
    surname: "",
    email: "another.email@acme.com",
    userId: "75853993475",
    roles: ""
}];
