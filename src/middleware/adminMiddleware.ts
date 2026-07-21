import { Request, Response, NextFunction } from "express";

export const admin = (req: Request, res: Response, next: NextFunction) => {
  // Assuming your 'protect' middleware attaches the user object to req.user
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};