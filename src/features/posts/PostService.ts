import { ObjectId } from "../../globals/Mongo.ts";
import { throwlhos } from "../../globals/Throwlhos.ts";
import { IPost } from "../../models/Post/IPost.ts";
import { PostRepository } from "../../models/Post/PostRepository.ts";

export class PostService {
    constructor(private readonly postRepository: PostRepository) { }

    private ensurePostOwner(post: IPost, userId: string) {
        const postAuthorId = String(post.author);
        const loggedUserId = String(userId);
        if (postAuthorId !== loggedUserId) {
            throw throwlhos.err_forbidden("You can only change your own posts", {
                postId: post._id,
                authorId: post.author,
                userId,
            });
        }
    }

    async create(newPost: IPost, authorId: string) {
        return await this.postRepository.create({
            ...newPost,
            author: ObjectId(authorId),
        });
    }

    async findAll() {
        const posts = await this.postRepository
            .findAll()            
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
        if (!post) {
            throw throwlhos.err_notFound("Post not found", { postId: id });
        }
        return post;
    }


    async updateById(id: string, data: Partial<IPost>, userId: string) {
        const currentPost = await this.postRepository.findById(id);
        if (!currentPost) {
            throw throwlhos.err_notFound("Post not found", { postId: id });
        }
        this.ensurePostOwner(currentPost, userId);

        const { title, content, published, tags } = data;
        const post = await this.postRepository.updateById(id, {
            title,
            content,
            published,
            tags,
        });
        if (!post) {
            throw throwlhos.err_notFound("Post not found", { postId: id });
        }
        return post;
    }

    async delete(id: string, userId: string) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw throwlhos.err_notFound("Post not found", { postId: id });
        }
        this.ensurePostOwner(post, userId);

        await this.postRepository.delete(id);
        return post;
    }
}
