import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

// Extend the Request interface to include the user object
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};