import { IBaseInterface } from "../../base/IBaseInterface.ts";
import { Types } from "mongoose";

export interface IPost extends IBaseInterface {
  title: string;
  content: string;
  author: Types.ObjectId;
  published?: boolean;
  tags?: string[];
  comments?: Types.ObjectId[];
}
