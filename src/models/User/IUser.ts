import { string } from "@zarco/isness";
import { IBaseInterface } from "../../base/IBaseInterface.ts";

export interface IUser extends IBaseInterface {
    username: string;
    password: string;
    bio?: string;
    avatar?: string;
}

export interface CreateUserInput {
    username: string;
    password: string;
    bio?: string;
    avatar?: string;
}