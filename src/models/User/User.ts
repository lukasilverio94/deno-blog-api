import { IUser } from "./IUser.ts";
import mongoose, { Schema } from "npm:mongoose@latest";

export class User implements IUser {
    username: IUser["username"];
    bio: IUser["bio"];
    avatar: IUser["avatar"];
    password: IUser["password"];

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
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        unique: true
    },
    bio: {
        type: String,
        required: false,
        default: null,
        trim: true,
        maxlength: 160,
    },
    avatar: {
        type: String,
        required: false,
        default: null,
        trim: true,
        maxlength: 300,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 256,
        select: false,
    }
}, {
    timestamps: true,
});

userSchema.loadClass(User);

export const UserModel = mongoose.model<IUser>('User', userSchema);
