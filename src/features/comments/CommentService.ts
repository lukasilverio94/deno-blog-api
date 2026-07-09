import { ObjectId } from "../../globals/Mongo.ts";
import { throwlhos } from "../../globals/Throwlhos.ts";
import { IComment } from "../../models/Comment/IComment.ts";
import { CommentRepository } from "../../models/Comment/CommentRepository.ts";
import { PostRepository } from "../../models/Post/PostRepository.ts";

export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly postRepository: PostRepository,
    ) {}

    private ensureCommentOwner(comment: IComment, userId: string) {
        const commentAuthor = String(comment.author);
        const loggedUserId = String(userId);
        if(commentAuthor !== loggedUserId) {
            throw throwlhos.err_forbidden("You can only change your own comments", {
                commentId: comment._id,
                authorId: comment.author,
                userId
            });
        }
    }   

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

        return await this.commentRepository.create({
            content: newComment.content,
            author: ObjectId(authorId),
            post: postObjectId,
        });
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

    async findByPost(postId: string) {
        const commentsInPost = await this.commentRepository.findByPost(postId);
        if (commentsInPost.length === 0) {
            throw throwlhos.err_notFound("No comments found in this post", { postId })}
        return commentsInPost;
    }

    async updateById(id: string, data: Partial<IComment>, userId: string) {
        const current = await this.commentRepository.findById(id);
        if(!current) {
            throw throwlhos.err_notFound("comment not found", { commentId: id });
        }
        this.ensureCommentOwner(current, userId);

        const comment = await this.commentRepository.updateById(id, {
            content: data.content,
        });
        if (!comment) {
            throw throwlhos.err_notFound("Comment not found", { commentId: id });
        }
        return comment;
    }

    async delete(id: string, userId: string) {
        const comment = await this.commentRepository.findById(id);
        if (!comment) {
            throw throwlhos.err_notFound("Comment not found", { commentId: id });
        }
        this.ensureCommentOwner(comment, userId);
        await this.commentRepository.delete(id);
        return comment;
    }
}
