import { ObjectId } from "../../globals/Mongo.ts";
import { throwlhos } from "../../globals/Throwlhos.ts";
import { IPost } from "../../models/Post/IPost.ts";
import { PostRepository } from "../../models/Post/PostRepository.ts";

export class PostService {
    constructor(private readonly postRepository: PostRepository) { }

    async create(newPost: IPost, authorId: string) {
        return await this.postRepository.create({
            ...newPost,
            author: ObjectId(authorId),
        });
    }

    async findAll() {
        const posts = await this.postRepository
            .findAll()
            .select("-comments")
            .populate("author", "username")
            .sort({ createdAt: -1 });
        if (!posts.length) {
            throw throwlhos.err_notFound("Not found any post");
        }
        return posts;
    }

    async findById(id: string) {
        const post = await this.postRepository
            .findOne({ _id: ObjectId(id) })
            .populate("author", "username")
            .populate("comments");
        if (!post) {
            throw throwlhos.err_notFound("Post not found", { postId: id });
        }
        return post;
    }

    async updateById(id: string, data: Partial<IPost>) {
        const post = await this.postRepository.updateById(id, data);
        if (!post) {
            throw throwlhos.err_notFound("Post not found", { postId: id });
        }
        return post;
    }

    async delete(id: string) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw throwlhos.err_notFound("Post not found", { postId: id });
        }
        await this.postRepository.delete(id);
    }
}
