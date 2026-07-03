import { User } from "../../models/User/User.ts";
import { UserRepository } from './../../models/User/UserRepository.ts';
import { Request, Response, Router } from 'npm:express'
const userRepository: UserRepository = new UserRepository();

export const createUser = async(req: Request, res: Response) => {
    try {
        const data = new User({
            username: req.body.username,
            bio: req.body.bio,
            avatar: req.body.avatar,
            password: req.body.password
        })
        const user = await userRepository.create(data);
        console.log('user is saved', user);
        res.status(201).send({user});
    
    } catch (error) {
        console.log('Error: ', error);
        res.status(400).json({message: 'oops something went wrong creating a user!'});
    }
}