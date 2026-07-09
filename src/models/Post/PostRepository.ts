import { IPost } from "./IPost.ts";
import { BaseRepository } from "../../base/BaseRepository.ts";
import { PostModel } from "./Post.ts";
import { ClientSession } from "mongoose";

export class PostRepository extends BaseRepository<IPost> {
    constructor() {
        super(PostModel);
    }

    deleteById(id: string, session: ClientSession) {
        return PostModel.findByIdAndDelete(id).session(session);
    }
}
