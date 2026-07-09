import { IComment } from './IComment.ts';
import { BaseRepository } from './../../base/BaseRepository.ts';
import { CommentModel } from "./Comment.ts";
import { ClientSession, Types } from "mongoose";

export class CommentRepository extends BaseRepository<IComment> {
    constructor() {
        super(CommentModel);
    }

    findByPost(postId: string | Types.ObjectId) {
        return this.model
            .find({ post: postId })
            .populate("author", "username")
            .sort({ createdAt: 1 });
    }

    deleteManyByPostId(postId: string, session: ClientSession) {
        return CommentModel.deleteMany({ post: postId }).session(session);
    }
}
