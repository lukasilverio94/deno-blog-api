import mongoose, {Schema} from 'mongoose';
import {IPost} from './IPost.ts';

export class Post implements IPost {
    title: IPost["title"];
    content: IPost["content"];
    author: IPost["author"];
    published: IPost["published"]
    tags: IPost["tags"];
    comments: IPost["comments"];

    constructor(post: IPost) {
        this.title = post.title;
        this.content = post.content;
        this.author = post.author;
        this.published = post.published;
        this.tags = post.tags;
        this.comments = post.comments;
    }
}

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: [4, 'Title too short'],
        trim: true
    },
    content: {
        type: String,
        required: true,
        minLength: [15, 'Post content should be at least 15 characters'],
        maxLength: [5000, 'Content cannot exceed 5000 characters'],
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    published: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        maxLength: [20, 'Each tag cannot exceed 20 characters'],
        required: false,
        default: null
    },
    comments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        default: []
    }
}, { timestamps: true });

postSchema.loadClass(Post);

export const PostModel = mongoose.model<IPost>('Post', postSchema);
