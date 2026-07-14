import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
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