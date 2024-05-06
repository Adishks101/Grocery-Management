import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errorHandler } from "../utility/middleware/errorHandler";

dotenv.config();

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required."));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(errorHandler(400, "Invalid Credentials."));
    }

    const { password: userPassword } = user;
    const isMatch = bcryptjs.compareSync(password, userPassword);

    if (isMatch) {
      const accessToken = jwt.sign(
        { id: user.id, userType: user.userType },
        process.env.JWT_ACCESS_SECRET_KEY!,
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
      );
      const refreshToken = jwt.sign(
        { id: user.id, userType: user.userType },
        process.env.JWT_REFRESH_SECRET_KEY!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
      );
      res
        .status(200)
        .cookie("access_token", accessToken, { httpOnly: true })
        .cookie("refresh_token", refreshToken, { httpOnly: true })
        .json(user);
    } else {
      return next(errorHandler(400, "Invalid Credentials."));
    }
  } catch (error) {
    next(error);
  }
};

const rotateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return next(errorHandler(401, "Refresh token not provided."));
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY!
    ) as { id: number; userType: string };

    const accessToken = jwt.sign(
      { id: decoded.id, userType: decoded.userType },
      process.env.JWT_ACCESS_SECRET_KEY!,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );

    res
      .status(200)
      .cookie("access_token", accessToken, { httpOnly: true })
      .json({ message: "Access token refreshed successfully." });
  } catch (error) {
    next(errorHandler(401, "Invalid refresh token."));
  }
};

export { signIn, rotateToken };
