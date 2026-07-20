import { Request } from 'express';

// Define the shape of your User object (or import your User type/model)
interface User {
  _id: any;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User; // This adds the user property to the Request type
    }
  }
}