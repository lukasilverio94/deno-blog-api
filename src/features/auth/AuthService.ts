import bcrypt from 'npm:bcrypt';
import { throwlhos } from "../../globals/Throwlhos.ts";
import { UserRepository } from './../../models/User/UserRepository.ts';
import { signToken } from "../../utils/AuthUtil.ts";

export class AuthService {
    constructor(private readonly userRepository: UserRepository){}

    async login(username: string, password: string) {
        const user = await this.userRepository.findOne({username});
        console.log("USer on AuthService: ", user);
        if (!user) {
            throwlhos.err_notFound("Invalid credentials");
        }
        
        const isMatch = await bcrypt.compare(password, user?.password);
        if(!isMatch) {
            throwlhos.err_unauthorized("Invalid credentials");
        }

        const token = signToken({ userId: user?._id });
        return token;
    }
}