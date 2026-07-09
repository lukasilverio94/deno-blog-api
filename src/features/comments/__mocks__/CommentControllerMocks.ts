import { throwlhos } from "../../../globals/Throwlhos.ts";

export const mockComment = {
  _id: "comment-id",
  content: "This is a valid test comment",
  author: "user-id",
  post: "post-id",
};

export const mockCommentList = [
  {
    _id: "comment-1",
    content: "First comment",
  },
  {
    _id: "comment-2",
    content: "Second comment",
  },
];

export const mockPostComments = [
  {
    _id: "comment-id",
    content: "comment content",
    post: "post-id",
  },
];

export const missingPostIdError = throwlhos.err_badRequest(
  "Post id is required to create a comment",
);

export const commentNotFoundError = throwlhos.err_notFound(
  "Comment not found",
  {
    commentId: "invalid-id",
  },
);

export const commentForbiddenError = throwlhos.err_forbidden(
  "You can only change your own comments",
  {
    commentId: "comment-id",
    userId: "other-user-id",
  },
);

export const commentValidationError = throwlhos.err_badRequest(
  "Invalid comment request",
  {
    id: "invalid-id",
  },
);

export const passingRules = {
  validate() {},
};

export const failingRules = {
  validate() {
    throw commentValidationError;
  },
};

export class MockCommentService {
  create() {
    return Promise.resolve(mockComment);
  }

  findById() {
    return Promise.resolve({
      ...mockComment,
      content: "comment content",
    });
  }

  findAll() {
    return Promise.resolve(mockCommentList);
  }

  findByPost() {
    return Promise.resolve(mockPostComments);
  }

  updateById() {
    return Promise.resolve({
      _id: "comment-id",
      content: "Updated comment content",
    });
  }

  delete() {
    return Promise.resolve(mockComment);
  }
}

export class MockCommentServiceMissingPostId {
  create() {
    return Promise.reject(missingPostIdError);
  }
}

export class MockCommentServiceNotFound {
  findById() {
    return Promise.reject(commentNotFoundError);
  }
}

export class MockCommentServiceForbidden {
  updateById() {
    return Promise.reject(commentForbiddenError);
  }
}
