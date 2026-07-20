import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // This validates the data and updates req.body
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      // Pass the error to your centralized errorHandler middleware
      next(error);
    }
  };
}