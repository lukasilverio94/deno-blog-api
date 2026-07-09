import "responser";
import { MockNextFunction, MockResponser } from "../../globals/Stubs.ts";
import { assertEquals } from "@std/assert";
import { Request } from "express";
import { AuthController } from "./AuthController.ts";
import { AuthService } from "./AuthService.ts";
import {
  MockAuthService,
  MockAuthServiceInvalidCredentials,
  MockAuthServiceUsernameConflict,
  MockAuthServiceValidation,
  authValidationError,
  failingRules,
  invalidCredentialsError,
  passingRules,
  usernameConflictError,
} from "./__mocks__/AuthControllerMocks.ts";

const authController = new AuthController(
  new MockAuthService() as unknown as AuthService,
  passingRules as any,
);

Deno.test("AuthController: should register a user", async () => {
  const request = {
    body: {
      username: "lucas",
      password: "test123",
      bio: "Developer",
      avatar: "avatar.png",
    },
  } as unknown as Request;

  const result = await authController.register(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 201);
  assertEquals(result.message, "Registered sucessfuly");
  assertEquals(result.data.token, "register-token");
});

Deno.test("AuthController: should login a user", async () => {
  const request = {
    body: {
      username: "lucas",
      password: "test123",
    },
  } as unknown as Request;

  const result = await authController.login(
    request,
    MockResponser as any,
    MockNextFunction as any,
  ) as any;

  assertEquals(result.code, 200);
  assertEquals(result.message, "Login successful");
  assertEquals(result.data.token, "login-token");
  assertEquals(result.data.user.userId, "user-id");
});

Deno.test("AuthController: should call next when login credentials are invalid", async () => {
  const controller = new AuthController(
    new MockAuthServiceInvalidCredentials() as unknown as AuthService,
    passingRules as any,
  );

  let receivedError: any;
  const next = (err: any) => {
    receivedError = err;
  };

  const request = {
    body: {
      username: "lucas",
      password: "wrong-password",
    },
  } as unknown as Request;

  await controller.login(request, MockResponser as any, next as any);

  assertEquals(receivedError, invalidCredentialsError);
  assertEquals(receivedError.code, 401);
  assertEquals(receivedError.message, "Invalid credentials");
});

Deno.test("AuthController: should call next when username already exists", async () => {
  const controller = new AuthController(
    new MockAuthServiceUsernameConflict() as unknown as AuthService,
    passingRules as any,
  );

  let receivedError: any;
  const next = (err: any) => {
    receivedError = err;
  };

  const request = {
    body: {
      username: "lucas",
      password: "test123",
    },
  } as unknown as Request;

  await controller.register(request, MockResponser as any, next as any);

  assertEquals(receivedError, usernameConflictError);
  assertEquals(receivedError.code, 409);
  assertEquals(receivedError.message, "Username already taken");
});

Deno.test("AuthController: should call next when validation fails", async () => {
  const controller = new AuthController(
    new MockAuthServiceValidation() as unknown as AuthService,
    failingRules as any,
  );

  let receivedError: any;
  const next = (err: any) => {
    receivedError = err;
  };

  const request = {
    body: {
      password: "test123",
    },
  } as unknown as Request;

  await controller.login(request, MockResponser as any, next as any);

  assertEquals(receivedError, authValidationError);
  assertEquals(receivedError.code, 400);
  assertEquals(receivedError.message, "Fields username invalids (1)");
});
