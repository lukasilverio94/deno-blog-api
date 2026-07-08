import is from "@zarco/isness";
import { BaseRules } from "../../base/BaseRules.ts";

export class PostRules extends BaseRules {
  constructor() {
    super();

    this.rc.addRule("id", {
      validator: is.objectId,
      message: "Id must be valid",
    });

    this.rc.addRules("title", [
      {
        validator: is.string,
        message: "Title must be a string",
      },
      {
        validator: (title: string) => title.length >= 4,
        message: "Title too short. Provide at least 4 characters",
      },
    ]);

    this.rc.addRules("content", [
      {
        validator: is.string,
        message: "Content must be a string",
      },
      {
        validator: (content: string) => content.length >= 15,
        message: "Post content should be at least 15 characters",
      },
      {
        validator: (content: string) => content.length <= 5000,
        message: "Content cannot exceed 5000 characters",
      },
    ]);

    this.rc.addRule("author", {
      validator: is.objectId,
      message: "Author must be a valid id",
    });

    this.rc.addRule("published", {
      validator: is.boolean,
      message: "Published must be a boolean",
    });

    this.rc.addRules("tags", [
      {
        validator: is.array,
        message: "Tags must be an array",
      },
      {
        validator: (tags: string[]) =>
          tags.every((tag) => typeof tag === "string"),
        message: "Each tag must be a string",
      },
      {
        validator: (tags: string[]) =>
          tags.every((tag) => tag.length <= 20),
        message: "Each tag cannot exceed 20 characters",
      },
    ]);
  }
}