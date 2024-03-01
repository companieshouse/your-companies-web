
import { User } from "../types/user";

const users: User[] = [{
    surname: "",
    email: "hannah.salt@gmail.com",
    user_id: "76896789",
    roles: ""
},
{
    surname: "",
    email: "james-morris@accounting.com",
    user_id: "5544332211",
    roles: ""
},
{
    surname: "",
    email: "j.example@gmail.com",
    user_id: "1122334455",
    roles: ""
},
{
    surname: "",
    email: "another.email@acme.com",
    user_id: "75853993475",
    roles: ""
}];

export const getUserRecord = (userId: string): Promise<User | undefined> => {
    const userRecord = users.find(user => user.user_id === userId);
    return Promise.resolve(userRecord);
};
