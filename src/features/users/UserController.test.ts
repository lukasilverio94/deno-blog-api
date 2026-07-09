import "responser";
import { MockNextFunction, MockResponser } from "../../globals/Stubs.ts";
import { assertEquals } from "@std/assert";
import { Request } from "express";
import { UserController } from "./UserController.ts";
import { UserService } from "./UserService.ts";
import {
  MockUserService,
  MockUserServiceNotFound,
  MockUserServiceValidation,
  failingRules,
  mockUser,
  passingRules,
  userNotFoundError,
  userValidationError,
} from "./__mocks__/UserControllerMocks.ts";

const controller = new UserController(
  new MockUserService() as unknown as UserService,
);

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
  assertEquals(result.data.user._id, mockUser._id);
  assertEquals(result.data.user.username, mockUser.username);
});

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

  assertEquals(result.code, 200);
  assertEquals(result.message, "User updated successfully");
  assertEquals(result.data.user._id, "user-1");
  assertEquals(result.data.user.username, "lucas-updated");
});

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

  assertEquals(result.code, 200);
  assertEquals(result.message, "User deleted successfully");
  assertEquals(result.data.user._id, "user-1");
  assertEquals(result.data.user.password, undefined);
});

Deno.test("UserController: should call next when user is not found", async () => {
  const controller = new UserController(
    new MockUserServiceNotFound() as unknown as UserService,
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

  assertEquals(receivedError, userNotFoundError);
  assertEquals(receivedError.code, 404);
  assertEquals(receivedError.message, "User not found");
});

Deno.test("UserController: should call next when request validation fails", async () => {
  const controller = new UserController(
    new MockUserServiceValidation() as unknown as UserService,
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

  assertEquals(receivedError, userValidationError);
  assertEquals(receivedError.code, 400);
  assertEquals(receivedError.message, "Invalid user id");
});
