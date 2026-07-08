import bcrypt from 'npm:bcrypt';
import { throwlhos } from "../../globals/Throwlhos.ts";
import { UserRepository } from './../../models/User/UserRepository.ts';
import { signToken } from "../../utils/AuthUtil.ts";

export class AuthService {
    constructor(private readonly userRepository: UserRepository) { }

    async login(username: string, password: string) {
        const user = await this.userRepository.findOne({ username }).select("+password");
        if (!user) {
            throw throwlhos.err_notFound("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw throwlhos.err_unauthorized("Invalid credentials");
        }

        const token = signToken({ userId: user._id });
        return {
            token,
            user: {
                userId: user._id,
                username: user.username,
            },
        };
    }
}