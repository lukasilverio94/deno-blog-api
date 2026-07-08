import is from "@zarco/isness";
import { BaseRules } from "../../base/BaseRules.ts";

export class CommentRules extends BaseRules {
  constructor() {
    super();

    this.rc.addRule("id", {
      validator: is.objectId,
      message: "Id must be valid",
    });

    this.rc.addRule("postId", {
      validator: is.objectId,
      message: "Post id must be valid",
    });

    this.rc.addRules("content", [
      {
        validator: is.string,
        message: "Content must be a string",
      },
      {
        validator: (content: string) => content.trim().length > 0,
        message: "Content cannot be empty",
      },
      {
        validator: (content: string) => content.length <= 2000,
        message: "Comment cannot exceed 2000 characters",
      },
    ]);
  }
}