import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errorHandler } from "../utility/middleware/errorHandler";

dotenv.config();

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required."));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(errorHandler(400, "Invalid Credentials."));
    }

    const { password: userPassword,} = user;
    const isMatch = bcryptjs.compareSync(password, userPassword);

    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, userType: user.userType },
        process.env.JWT_SECRET_KEY!
      );
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(user);
    } else {
      return next(errorHandler(400, "Invalid Credentials."));
    }
  } catch (error) {
    next(error);
  }
};
