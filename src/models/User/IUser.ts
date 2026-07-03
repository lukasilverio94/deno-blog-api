import { IBaseInterface } from "../../base/IBaseInterface.ts";

export interface IUser extends IBaseInterface {
    username?: string; 
    password?: string;
    bio?: string;
    avatar?: string;
}