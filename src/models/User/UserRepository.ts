import {  UserModel } from './User.ts';
import { IUser } from './IUser.ts';
import { BaseRepository } from './../../base/BaseRepository.ts';

export class UserRepository extends BaseRepository<IUser> {
    constructor(){
        super(UserModel);
    }
}