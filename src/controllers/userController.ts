import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log("DEBUG - Request Body:", req.body);
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString());
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    next(error); // This sends the error to your errorHandler.ts
  }
};

// Login user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    // Check if user exists and compare passwords
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Because you used the 'protect' middleware, 'req.user' is now available
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};