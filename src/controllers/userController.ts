import { Request, Response } from 'express';
import { User } from '../models/userModel';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';

class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = 'AppError';
  }
}

type AsyncRequestHandler = (req: Request, res: Response, next?: any) => Promise<any>;

const asyncHandler = (fn: AsyncRequestHandler) => (
  req: Request,
  res: Response,
  next?: any
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// POST /api/users - Register user
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    throw new AppError('Invalid user data', 400);
  }
});

// POST /api/users/login - Authenticate user
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Ensure you use the 'as string' cast here to satisfy TypeScript
  if (user && (await bcrypt.compare(password, user.password as string))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    throw new AppError('Invalid email or password', 401);
  }
});

// GET /api/users/profile - Get user profile
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  // req.user is populated by your 'protect' middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    throw new AppError('User not found', 404);
  }
});