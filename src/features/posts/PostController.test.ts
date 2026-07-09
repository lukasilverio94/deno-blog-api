import "responser";
import { MockNextFunction, MockResponser } from "../../globals/Stubs.ts";
import { assertEquals } from "@std/assert";
import { Request } from "express";
import { PostController } from "./PostController.ts";
import { PostService } from "./PostService.ts";
import {
  failingRules,
  mockPost,
  MockPostService,
  MockPostServiceForbidden,
  MockPostServiceNotFound,
  passingRules,
  postForbiddenError,
  postNotFoundError,
  postValidationError,
} from "./__mocks__/PostControllerMocks.ts";

const postController = new PostController(
  new MockPostService() as unknown as PostService,
  passingRules as any,
);

Deno.test("PostController: should create a post", async () => {
  const request = {
    body: {
      title: mockPost.title,
      content: mockPost.content,
      published: mockPost.published,
      tags: mockPost.tags,
    },
    userId: "user-id",
  } as unknown as Request;

  const result = await postController.create(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.message, "Post created successfully");
  assertEquals(result.data.post._id, mockPost._id);
});

Deno.test("PostController: should show a post", async () => {
  const request = {
    params: {
      id: "post-id",
    },
  } as unknown as Request;

  const result = await postController.findById(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.message, "Post found");
  assertEquals(result.data.post._id, mockPost._id);
});

Deno.test("PostController: should return all posts", async () => {
  const result = await postController.findAll(
    {} as Request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.message, "All posts found");
  assertEquals(result.data.posts.length, 2);
});

Deno.test("PostController: should update a post", async () => {
  const request = {
    params: {
      id: "post-id",
    },
    body: {
      title: "Updated title",
    },
    userId: "user-id",
  } as unknown as Request;

  const result = await postController.update(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.message, "Post updated successfully");
  assertEquals(result.data.post._id, "post-id");
});

Deno.test("PostController: should delete a post", async () => {
  const request = {
    params: {
      id: "post-id",
    },
    userId: "user-id",
  } as unknown as Request;

  const result = await postController.delete(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.message, "Post deleted successfully");
  assertEquals(result.data.post._id, "post-id");
});

Deno.test("PostController: should call next when post is not found", async () => {
  const controller = new PostController(
    new MockPostServiceNotFound() as unknown as PostService,
    passingRules as any,
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

  assertEquals(receivedError, postNotFoundError);
  assertEquals(receivedError.code, 404);
  assertEquals(receivedError.message, "Post not found");
});

Deno.test("PostController: should call next when user is not post owner", async () => {
  const controller = new PostController(
    new MockPostServiceForbidden() as unknown as PostService,
    passingRules as any,
  );

  let receivedError: any;
  const next = (err: any) => {
    receivedError = err;
  };

  const request = {
    params: {
      id: "post-id",
    },
    body: {
      title: "Updated title",
    },
    userId: "other-user-id",
  } as unknown as Request;

  await controller.update(request, MockResponser as any, next as any);

  assertEquals(receivedError, postForbiddenError);
  assertEquals(receivedError.code, 403);
  assertEquals(receivedError.message, "You can only change your own posts");
});

Deno.test("PostController: should call next when request validation fails", async () => {
  const controller = new PostController(
    new MockPostService() as unknown as PostService,
    failingRules as any,
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

  assertEquals(receivedError, postValidationError);
  assertEquals(receivedError.code, 400);
  assertEquals(receivedError.message, "Invalid post request");
});
