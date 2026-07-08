import { IPost } from "./IPost.ts";
import { BaseRepository } from "../../base/BaseRepository.ts";
import { PostModel } from "./Post.ts";
import { ClientSession, Types } from "mongoose";

export class PostRepository extends BaseRepository<IPost> {
    constructor() {
        super(PostModel);
    }

    addComment(postId: string | Types.ObjectId, commentId: Types.ObjectId, session: ClientSession) {
        return PostModel.findByIdAndUpdate(
            postId,
            { $addToSet: { comments: commentId } },
            { new: true, runValidators: true, session },
        );
    }
}