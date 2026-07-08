import "responser";
import { MockResponser, MockNextFunction } from "../../globals/Stubs.ts";
import { assertEquals } from "@std/assert";
import { Request } from "express";
import { UserController } from "./UserController.ts";
import { UserService } from "./UserService.ts";

class MockUserService {
  findAll() {
    return Promise.resolve([
      {
        _id: "user-1",
        username: "lucas",
        bio: "Developer",
        avatar: "avatar.png",
      },
      {
        _id: "user-2",
        username: "john",
        bio: "Backend Dev",
        avatar: "john.png",
      },
    ]);
  }

  findById() {
    return Promise.resolve({
      _id: "user-1",
      username: "lucas",
      bio: "Developer",
      avatar: "avatar.png",
    });
  }

  updateById() {
    return Promise.resolve({
      _id: "user-1",
      username: "lucas-updated",
      bio: "Updated bio",
      avatar: "avatar.png",
    });
  }

  delete() {
    return Promise.resolve();
  }
}

const mockUserService = new MockUserService();

const controller = new UserController(
  mockUserService as unknown as UserService,
);
// -------------------- findAll --------------------------------
Deno.test("UserController: should return all users", async () => {
  const result = await controller.findAll(
    {} as Request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.message, "All users found");
  assertEquals(result.data.users.length, 2);
});

// -------------------- findById --------------------------------
Deno.test("UserController: should return a user by id", async () => {
  const request = {
    params: {
      id: "user-1",
    },
  } as unknown as Request;

  const result = await controller.findById(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.data.user._id, "user-1");
  assertEquals(result.data.user.username, "lucas");
});

// -------------------- update --------------------------------
Deno.test("UserController: should update a user", async () => {
  const request = {
    params: {
      id: "user-1",
    },
    body: {
      username: "lucas-updated",
      bio: "Updated bio",
    },
  } as unknown as Request;

  const result = await controller.update(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 204);
  assertEquals(result.message, "User updated successfully");
  assertEquals(result.data.userId, "user-1");
});

// -------------------- delete --------------------------------
Deno.test("UserController: should delete a user", async () => {
  const request = {
    params: {
      id: "user-1",
    },
  } as unknown as Request;

  const result = await controller.delete(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 204);
  assertEquals(result.message, "User deleted successfully");
  assertEquals(result.data.userId, "user-1");
});