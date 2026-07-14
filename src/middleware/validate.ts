import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

// Validates body/params/query against a Zod schema.
// Usage: router.post("/", validate(createUserSchema), createUser)
export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}