import { IUser } from "./IUser.ts";
import mongoose, { Schema } from "npm:mongoose@latest";

export class User implements IUser {
    username: IUser["username"]
    bio: IUser["bio"]
    avatar: IUser["avatar"]
    password: IUser["password"]

    constructor(user: IUser) {
        this.username = user.username;
        this.bio = user.bio;
        this.avatar = user.avatar;
        this.password = user.password;
    }
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);