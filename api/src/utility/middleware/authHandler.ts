import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler";
import dotenv from "dotenv";
dotenv.config();

const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY!);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies) {      
       next(
        errorHandler(401, "You are not authorized to perform this action")
      );
      
      return;
    }
    const decoded = decodeToken(req.cookies.access_token);

    if (
      decoded &&
      typeof decoded === "object" &&
      decoded.userType === "admin"
    ) {
      req.cookies.user = decoded;
      next();
    } else {
      return next(
        errorHandler(401, "You are not authorized to perform this action")
      );
    }
  } catch (error) {
   return next(errorHandler(401, "You are not authorized to perform this action"));
  }
};
const isUser = (req: Request, res: Response, next: NextFunction) => {
  const decoded = decodeToken(req.cookies.access_token);

  if (decoded) {
    req.cookies.user = decoded;
    next();
  } else {
    next(errorHandler(401, "You are not authorized to perform this action"));
    return;
  }
};

export { isAdmin, isUser };
