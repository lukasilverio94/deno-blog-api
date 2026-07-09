import { throwlhos } from "../../../globals/Throwlhos.ts";

export const mockPost = {
  _id: "post-id",
  title: "Test post",
  content: "This is a valid test post content.",
  author: "user-id",
  published: true,
  tags: ["deno"],
};

export const mockPostList = [
  {
    _id: "post-1",
    title: "First",
  },
  {
    _id: "post-2",
    title: "Second",
  },
];

export const postNotFoundError = throwlhos.err_notFound("Post not found", {
  postId: "invalid-id",
});

export const postForbiddenError = throwlhos.err_forbidden(
  "You can only change your own posts",
  {
    postId: "post-id",
    userId: "other-user-id",
  },
);

export class MockPostService {
  create() {
    return Promise.resolve(mockPost);
  }

  findById() {
    return Promise.resolve(mockPost);
  }

  findAll() {
    return Promise.resolve(mockPostList);
  }

  updateById() {
    return Promise.resolve(mockPost);
  }

  delete() {
    return Promise.resolve(mockPost);
  }
}

export class MockPostServiceNotFound {
  findById() {
    return Promise.reject(postNotFoundError);
  }
}

export class MockPostServiceForbidden {
  updateById() {
    return Promise.reject(postForbiddenError);
  }
}
