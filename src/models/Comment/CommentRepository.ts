import { IComment } from './IComment.ts';
import { BaseRepository } from './../../base/BaseRepository.ts';
import { CommentModel } from "./Comment.ts";

export class CommentRepository extends BaseRepository<IComment> {
    constructor() {
        super(CommentModel);
    }
}