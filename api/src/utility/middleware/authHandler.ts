import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler";
import dotenv from "dotenv";
import User from "../../models/User";
dotenv.config();

const decodeToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY!);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies) {
      next(errorHandler(401, "You are not authorized to perform this action"));

      return;
    }
    const decoded = decodeToken(req.cookies.access_token);
    if(!decoded) {
      return next(
        errorHandler(401, "You are not authorized to perform this action2")
      );
    }
    else if (typeof decoded === "object" && decoded.id) {
      const user = await User.findByPk(decoded.id);
      if (!user || user.userType != "admin" || user.status != "active") {
        return next(
          errorHandler(401, "You are not authorized to perform this action")
        );
      }
       else {
        req.cookies.user = decoded;
        next();
      }
    }
  } catch (error) {
    return next(
      errorHandler(401, "You are not authorized to perform this action")
    );
  }
};

const isUser = async(req: Request, res: Response, next: NextFunction) => {
  const decoded = decodeToken(req.cookies.access_token);
  if(!decoded) {
    return next(
      errorHandler(401, "You are not authorized to perform this action")
    );
  }
  else if (typeof decoded === "object" && decoded.id) {
    const user = await User.findByPk(decoded.id);
    if (!user || user.status != "active") {
      return next(
        errorHandler(401, "You are not authorized to perform this action")
      );
    } else {
      req.cookies.user = decoded;
      next();
    }
  }
};

export { isAdmin, isUser };
