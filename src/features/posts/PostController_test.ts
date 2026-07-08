import "responser";
import { MockResponser, MockNextFunction} from './../../globals/Stubs.ts';
import { assertEquals } from "@std/assert";
import { Request } from "express";
import { PostController } from "./PostController.ts";
import { PostService } from "./PostService.ts";

class MockPostService {
  create() {
    return Promise.resolve({
      _id: "post-id",
      title: "Test post",
      content: "This is a valid test post content.",
      author: "user-id",
      published: true,
      tags: ["deno"],
    });
  }

  findById() {
    return Promise.resolve({
      _id: "post-id",
      title: "Test post",
      content: "This is a valid test post content.",
      author: "user-id",
      published: true,
      tags: ["deno"],
    });
  }

  findAll() {
    return Promise.resolve([
      {
        _id: "post-1",
        title: "First",
      },
      {
        _id: "post-2",
        title: "Second",
      },
    ]);
  }

  updateById() {
    return Promise.resolve({
      _id: "post-id",
    });
  }

  delete() {
    return Promise.resolve();
  }
}

const mockPostService = new MockPostService();
const postController = new PostController(
  mockPostService as unknown as PostService,
);
// -------------------- create --------------------------------
Deno.test("PostController: should create a post", async () => {
  const request = {
    body: {
      title: "Test post",
      content: "This is a valid test post content.",
      published: true,
      tags: ["deno"],
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
  assertEquals(result.data.post._id, "post-id");
});

// -------------------- findById --------------------------------
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

  assertEquals(result.message, "");
  assertEquals(result.data.post._id, "post-id");
});

// -------------------- findAll --------------------------------
Deno.test("PostController: should return all posts", async () => {
  const result = await postController.findAll(
    {} as Request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.message, "All posts found");
  assertEquals(result.data.posts.length, 2);
});

// -------------------- update --------------------------------
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

  assertEquals(result.code, 204);
  assertEquals(result.message, "Post updated successfully");
  assertEquals(result.data.postId, "post-id");
});

// -------------------- delete --------------------------------
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

  assertEquals(result.code, 204);
  assertEquals(result.message, "Post deleted successfully");
  assertEquals(result.data.postId, "post-id");
});