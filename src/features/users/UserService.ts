import { ObjectId } from "../../globals/Mongo.ts";
import bcrypt from "bcrypt";
import { throwlhos } from "../../globals/Throwlhos.ts";
import { IUser } from "../../models/User/IUser.ts";
import { UserRepository } from './../../models/User/UserRepository.ts';

export class UserService {

    constructor(private readonly userRepository: UserRepository) { }

    async findByUserName(username: string) {
        return await this.userRepository.findOne({ username });
    }

    async findAll() {
        const users = await this.userRepository.findAll().select("-password").sort({ createdAt: -1 });
        if (!users.length) {
            throw throwlhos.err_notFound("Not found any user");
        }
        return users;
    }

    async findById(id: string) {
        const user = await this.userRepository.findOne({ _id: ObjectId(id) }).select("-password");
        if (!user) {
            throw throwlhos.err_notFound("User not found", { userId: id });
        }
        return user;
    }

    async updateById(id: string, data: IUser) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 12);
        }
        const user = await this.userRepository.updateById(id, data);
        if (!user) {
            throw throwlhos.err_notFound("User not found", { userId: id });
        }
        return user;
    }

    async delete(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw throwlhos.err_notFound("User not found", { userId: id });
        }
        await this.userRepository.delete(id);
    }
}