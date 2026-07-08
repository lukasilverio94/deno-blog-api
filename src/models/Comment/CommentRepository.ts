import { IComment } from './IComment.ts';
import { BaseRepository } from './../../base/BaseRepository.ts';
import { CommentModel } from "./Comment.ts";
import { ClientSession } from "mongoose";

export class CommentRepository extends BaseRepository<IComment> {
    constructor() {
        super(CommentModel);
    }

    createWithSession(data: Partial<IComment>, session: ClientSession) {
        return CommentModel.create([data], { session });
    }
}