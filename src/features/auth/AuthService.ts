import { CreateUserInput, IUser } from "./../../models/User/IUser.ts";
import bcrypt from "npm:bcrypt";
import { throwlhos } from "../../globals/Throwlhos.ts";
import { UserRepository } from "./../../models/User/UserRepository.ts";
import { signToken } from "../../utils/AuthUtil.ts";
import { toPublicUser } from "../../models/User/UserMapper.ts";

export class AuthService {
    constructor(private readonly userRepository: UserRepository) { }

    async register(data: CreateUserInput) {
        const existing = await this.userRepository.findOne({
            username: data.username,
        });
        if (existing) {
            throw throwlhos.err_conflict(
                "Username already taken",
                { user: existing._id },
            );
        }
        const hashed = await bcrypt.hash(data.password, 12);
        const user = await this.userRepository.create({
            ...data,
            password: hashed,
        });

        const token = signToken({
            userId: user._id.toString(),
        });
        return {
            token,
            user: toPublicUser(user),
        };
    }

    async login(username: string, password: string) {
        const user = await this.userRepository.findOne({ username }).select(
            "+password",
        );
        if (!user) {
            throw throwlhos.err_unauthorized("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw throwlhos.err_unauthorized("Invalid credentials");
        }

        const token = signToken({ userId: String(user._id) });
        return {
            token,
            user: toPublicUser(user),
        };
    }

    async getCurrentUser(userId: string) {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw throwlhos.err_unauthorized("User not found or session is invalid");
        }
        return toPublicUser(user);
    }
}