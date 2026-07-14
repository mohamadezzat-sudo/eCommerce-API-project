import jwt from "jsonwebtoken";

// Ensure you have JWT_SECRET in your .env file
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export default generateToken;