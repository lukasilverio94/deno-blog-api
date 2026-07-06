import { Types } from 'mongoose';
import { IBaseInterface } from './../../base/IBaseInterface.ts';

export interface IComment extends IBaseInterface {
    content: string;
    author: Types.ObjectId;
    post: Types.ObjectId;
}