import mongoose, { Schema } from 'mongoose';
import { IComment } from './IComment.ts';

export class Comment implements IComment {
    content: IComment["content"];
    author: IComment["author"];
    post: IComment["post"];

    constructor(comment: IComment) {
        this.content = comment.content;
        this.author = comment.author;
        this.post = comment.post;
    }
}

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxLength: [2000, 'Comment cannot exceed 2000 characters'],
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, { timestamps: true });

commentSchema.loadClass(Comment);

export const CommentModel = mongoose.model<IComment>('Comment', commentSchema);