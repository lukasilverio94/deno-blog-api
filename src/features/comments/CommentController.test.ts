import "responser";
import { MockNextFunction, MockResponser } from "../../globals/Stubs.ts";
import { assertEquals } from "@std/assert";
import { Request } from "express";
import { CommentController } from "./CommentController.ts";
import { CommentService } from "./CommentService.ts";
import {
  MockCommentService,
  MockCommentServiceForbidden,
  MockCommentServiceMissingPostId,
  MockCommentServiceNotFound,
  commentForbiddenError,
  commentNotFoundError,
  missingPostIdError,
  mockComment,
} from "./__mocks__/CommentControllerMocks.ts";

const commentController = new CommentController(
  new MockCommentService() as unknown as CommentService,
);

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
  assertEquals(result.data.comment._id, mockComment._id);
});

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
  assertEquals(result.data.comment._id, mockComment._id);
});

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
  assertEquals(result.data.comments[0]._id, mockComment._id);
});

Deno.test("CommentController: should update a comment", async () => {
  const request = {
    params: {
      id: "comment-id",
    },
    body: {
      content: "Updated comment content",
    },
    userId: "user-id",
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

Deno.test("CommentController: should delete a comment", async () => {
  const request = {
    params: {
      id: "comment-id",
    },
    userId: "user-id",
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

Deno.test("CommentController: should call next when post id is missing", async () => {
  const controller = new CommentController(
    new MockCommentServiceMissingPostId() as unknown as CommentService,
  );

  let receivedError: any;
  const next = (err: any) => {
    receivedError = err;
  };

  const request = {
    params: {},
    body: {
      content: "Test comment",
    },
    userId: "user-id",
  } as unknown as Request;

  await controller.create(request, MockResponser as any, next as any);

  assertEquals(receivedError, missingPostIdError);
  assertEquals(receivedError.code, 400);
  assertEquals(receivedError.message, "Post id is required to create a comment");
});

Deno.test("CommentController: should call next when comment is not found", async () => {
  const controller = new CommentController(
    new MockCommentServiceNotFound() as unknown as CommentService,
  );

  let receivedError: any;
  const next = (err: any) => {
    receivedError = err;
  };

  const request = {
    params: {
      id: "invalid-id",
    },
  } as unknown as Request;

  await controller.findById(request, MockResponser as any, next as any);

  assertEquals(receivedError, commentNotFoundError);
  assertEquals(receivedError.code, 404);
  assertEquals(receivedError.message, "Comment not found");
});

Deno.test("CommentController: should call next when user is not comment owner", async () => {
  const controller = new CommentController(
    new MockCommentServiceForbidden() as unknown as CommentService,
  );

  let receivedError: any;
  const next = (err: any) => {
    receivedError = err;
  };

  const request = {
    params: {
      id: "comment-id",
    },
    body: {
      content: "Trying to update someone else's comment",
    },
    userId: "other-user-id",
  } as unknown as Request;

  await controller.update(request, MockResponser as any, next as any);

  assertEquals(receivedError, commentForbiddenError);
  assertEquals(receivedError.code, 403);
  assertEquals(receivedError.message, "You can only change your own comments");
});
