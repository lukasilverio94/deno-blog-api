import "responser";
import { CommentService } from "./CommentService.ts";
import { MockResponser, MockNextFunction } from "./../../globals/Stubs.ts";
import { assertEquals } from "@std/assert";
import { Request } from "express";
import { CommentController } from "./CommentController.ts";


class MockCommentService {
  create() {
    return Promise.resolve({
      _id: "comment-id",
      content: "This is a valid test comment",
      author: "user-id",
      post: "post-id",
    });
  }

  findById() {
    return Promise.resolve({
      _id: "comment-id",
      content: "comment content",
      author: "user-id",
      post: "post-id",
    });
  }

  findAll() {
    return Promise.resolve([
      {
        _id: "comment-1",
        content: "First comment",
      },
      {
        _id: "comment-2",
        content: "Second comment",
      },
    ]);
  }

  findByPost() {
    return Promise.resolve([
      {
        _id: "comment-id",
        content: "comment content",
        post: "post-id",
      },
    ]);
  }

  updateById() {
    return Promise.resolve({
      _id: "comment-id",
      content: "Updated comment content",
    });
  }

  delete() {
    return Promise.resolve();
  }
}

const commentController = new CommentController(
  new MockCommentService() as unknown as CommentService,
);


// -------------------- create --------------------------------
Deno.test("CommentController: should create a comment", async () => {
  const request = {
    params: {
      postId: "post-id",
    },
    body: {
      content: "This is a valid test comment",
    },
    userId: "user-id",
  } as unknown as Request;


  const result = await commentController.create(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 201);
  assertEquals(result.message, "Comment created");
  assertEquals(result.data.comment._id, "comment-id");
});

// -------------------- findById --------------------------------
Deno.test("CommentController: should show a comment", async () => {
  const request = {
    params: {
      id: "comment-id",
    },
  } as unknown as Request;

  const result = await commentController.findById(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.message, "Comment found");
  assertEquals(result.data.comment._id, "comment-id");
});

// -------------------- findAll --------------------------------
Deno.test("CommentController: should return all comments", async () => {
  const result = await commentController.findAll(
    {} as Request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.message, "All comments found");
  assertEquals(result.data.comments.length, 2);
});

// -------------------- findByPost --------------------------------
Deno.test("CommentController: should return comments from post", async () => {
  const request = {
    params: {
      postId: "post-id",
    },
  } as unknown as Request;

  const result = await commentController.findByPost(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.data.comments.length, 1);
  assertEquals(result.data.comments[0]._id, "comment-id");
});

// -------------------- update --------------------------------
Deno.test("CommentController: should update a comment", async () => {
  const request = {
    params: {
      id: "comment-id",
    },
    body: {
      content: "Updated comment content",
    },
  } as unknown as Request;

  const result = await commentController.update(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 204);
  assertEquals(result.message, "Comment updated successfully");
  assertEquals(result.data.commentId, "comment-id");
});

// -------------------- delete --------------------------------
Deno.test("CommentController: should delete a comment", async () => {
  const request = {
    params: {
      id: "comment-id",
    },
  } as unknown as Request;

  const result = await commentController.delete(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 204);
  assertEquals(result.message, "Comment deleted successfully");
  assertEquals(result.data.commentId, "comment-id");
});