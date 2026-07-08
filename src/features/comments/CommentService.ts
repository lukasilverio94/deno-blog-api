import mongoose from "mongoose";
import { ObjectId, StartTransaction } from "../../globals/Mongo.ts";
import { throwlhos } from "../../globals/Throwlhos.ts";
import { IComment } from "../../models/Comment/IComment.ts";
import { CommentRepository } from "../../models/Comment/CommentRepository.ts";
import { PostRepository } from "../../models/Post/PostRepository.ts";

export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly postRepository: PostRepository,
    ) {}

    async create(newComment: IComment & { postId?: string }, authorId: string, postId?: string) {
        const commentPostId = postId ?? newComment.postId ?? newComment.post?.toString();
        if (!commentPostId) {
            throw throwlhos.err_badRequest("Post id is required to create a comment");
        }

        const postObjectId = ObjectId(commentPostId);
        const post = await this.postRepository.findById(postObjectId);
        if (!post) {
            throw throwlhos.err_notFound("Post not found", { postId: commentPostId });
        }

        const session = await StartTransaction(mongoose.connection);

        try {
            const [comment] = await this.commentRepository.createWithSession({
                content: newComment.content,
                author: ObjectId(authorId),
                post: postObjectId,
            }, session);

            await this.postRepository.addComment(postObjectId, comment._id, session);

            await session.commitTransaction();
            return comment;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async findAll() {
        const comments = await this.commentRepository
            .findAll()
            .populate("author", "username")
            .populate("post", "title")
            .sort({ createdAt: -1 });
        if (!comments.length) {
            throw throwlhos.err_notFound("Not found any comment");
        }
        return comments;
    }

    async findById(id: string) {
        const comment = await this.commentRepository
            .findOne({ _id: ObjectId(id) })
            .populate("author", "username")
            .populate("post", "title");
        if (!comment) {
            throw throwlhos.err_notFound("Comment not found", { commentId: id });
        }
        return comment;
    }

    async updateById(id: string, data: Partial<IComment>) {
        const comment = await this.commentRepository.updateById(id, data);
        if (!comment) {
            throw throwlhos.err_notFound("Comment not found", { commentId: id });
        }
        return comment;
    }

    async delete(id: string) {
        const comment = await this.commentRepository.findById(id);
        if (!comment) {
            throw throwlhos.err_notFound("Comment not found", { commentId: id });
        }
        await this.commentRepository.delete(id);
    }
}
