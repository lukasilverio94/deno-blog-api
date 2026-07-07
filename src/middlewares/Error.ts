import { NextFunction, Request, Response } from "express";

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(error);
  res.send_internalServerError("Something went wrong", { error });
};