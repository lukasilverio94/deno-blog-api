import is from '@zarco/isness';
import { BaseRules } from "../base/BaseRules.ts";

export class UserRules extends BaseRules {
    constructor() {
        super();

        this.rc.addRule("id", {
            validator: is.objectId,
            message: "Id must be valid" 
        });

        this.rc.addRules("username", [
            {
                validator: is.string,
                message: "Username must be a string",
            },
            {
                validator: (username: string) => username.length >= 3,
                message: 'Username too short. Provide at least 3 characters',
            },
        ]);

        this.rc.addRules("bio", [
            {
                validator: is.string,
                message: "Bio must be a string",
            },
            {
                validator: (bio: string) => bio.length <= 160,
                message: 'Bio too long, use max of 160 characters, just a short text about you!',
            },
        ]);

           this.rc.addRules("avatar", [
            {
                validator: is.string,
                message: "Avatar must be a string",
            },
            {
                validator: (username: string) => username.length <= 300,
                message: 'Avatar too long. Use max of 300 characters!',
            },
        ]);

         this.rc.addRules('password', [
            {
                validator: is.string,
                message: 'Password must be a string',
            },
            {
                validator: (password: string) => password.length >= 6,
                message: 'Password must have at least 6 characters',
            },
        ]);


    }
}