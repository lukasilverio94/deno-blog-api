import { ObjectId } from "../../globals/Mongo.ts";
import { throwlhos } from "../../globals/Throwlhos.ts";
import { IComment } from "../../models/Comment/IComment.ts";
import { CommentRepository } from "../../models/Comment/CommentRepository.ts";

export class CommentService {
    constructor(private readonly commentRepository: CommentRepository) {}

    async create(newComment: IComment) {
        return await this.commentRepository.create(newComment);
    }

    async findAll() {
        const comments = await this.commentRepository.findAll().sort({ createdAt: -1 });
        if (!comments.length) {
            throw throwlhos.err_notFound("Not found any comment");
        }
        return comments;
    }

    async findById(id: string) {
        const comment = await this.commentRepository.findOne({ _id: ObjectId(id) });
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
