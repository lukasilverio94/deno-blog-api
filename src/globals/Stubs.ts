import { Response } from "express";

  export const MockResponser = {
    send_ok: (message: string, data?: unknown) => ({
      success: true,
      message,
      data,
      code: 200,
      status: "OK",
    }),

    send_created: (message: string, data?: unknown) => ({
      success: true,
      message,
      data,
      code: 201,
      status: "CREATED",
    }),

    send_noContent: (message: string, data?: unknown) => ({
      success: true,
      message,
      data,
      code: 204,
      status: "NO_CONTENT",
    }),

    send_badRequest: (message: string, data?: unknown) => ({
      success: false,
      errors: data,
      message,
      code: 400,
      status: "BAD_REQUEST",
    }),

    send_unauthorized: (message: string, data?: unknown) => ({
      success: false,
      errors: data,
      message,
      code: 401,
      status: "UNAUTHORIZED",
    }),

    send_forbidden: (message: string, data?: unknown) => ({
      success: false,
      errors: data,
      message,
      code: 403,
      status: "FORBIDDEN",
    }),

    send_notFound: (message: string, data?: unknown) => ({
      success: false,
      errors: data,
      message,
      code: 404,
      status: "NOT_FOUND",
    }),

    send_conflict: (message: string, data?: unknown) => ({
      success: false,
      errors: data,
      message,
      code: 409,
      status: "CONFLICT",
    }),

    send_unprocessableEntity: (message: string, data?: unknown) => ({
      success: false,
      errors: data,
      message,
      code: 422,
      status: "UNPROCESSABLE_ENTITY",
    }),

    send_internalServerError: (message: string, data?: unknown) => ({
      success: false,
      errors: data,
      message,
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
    }),
  } as unknown as Response;

  export const MockNextFunction = (error: unknown) => {
    return error;
  };
