import {IPost} from "./IPost.ts";
import {BaseRepository} from "../../base/BaseRepository.ts";
import {PostModel} from "./Post.ts";

export class PostRepository extends BaseRepository<IPost> {
    constructor() {
        super(PostModel);
    }
}