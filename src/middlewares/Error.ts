import { NextFunction, Request, Response } from "express";
import { IThrowlhos } from "npm:throwlhos";

type ResponseSender = (this: Response, message: string, content?: unknown) => void;

const responseByCode: Record<number, keyof Response> = {
  400: "send_badRequest",
  401: "send_unauthorized",
  403: "send_forbidden",
  404: "send_notFound",
  409: "send_conflict",
  422: "send_unprocessableEntity",
};

const isThrowlhosError = (error: unknown): error is IThrowlhos => {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    "status" in error &&
    "message" in error
  );
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  if (isThrowlhosError(error)) {
    const send = responseByCode[error.code];
    if (send && typeof res[send] === "function") {
      const sendError = res[send] as unknown as ResponseSender;
      return sendError.call(res, error.message, error.errors);
    }
  }

  return res.send_internalServerError("Something went wrong", { error });
};