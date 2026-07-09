import { throwlhos } from "../../../globals/Throwlhos.ts";

export const mockUser = {
  _id: "user-1",
  username: "lucas",
  bio: "Developer",
  avatar: "avatar.png",
};

export const mockUserList = [
  mockUser,
  {
    _id: "user-2",
    username: "john",
    bio: "Backend Dev",
    avatar: "john.png",
  },
];

export const userNotFoundError = throwlhos.err_notFound("User not found", {
  userId: "invalid-id",
});

export const userValidationError = throwlhos.err_badRequest("Invalid user id", {
  _id: "invalid-id",
});

export const passingRules = {
  validate() {},
};

export const failingRules = {
  validate() {
    throw userValidationError;
  },
};

export class MockUserService {
  findAll() {
    return Promise.resolve(mockUserList);
  }

  findById() {
    return Promise.resolve(mockUser);
  }

  updateById() {
    return Promise.resolve({
      ...mockUser,
      username: "lucas-updated",
      bio: "Updated bio",
    });
  }

  delete() {
    return Promise.resolve();
  }
}

export class MockUserServiceNotFound {
  findById() {
    return Promise.reject(userNotFoundError);
  }
}

export class MockUserServiceValidation {
  findById() {
    return Promise.resolve({});
  }
}
