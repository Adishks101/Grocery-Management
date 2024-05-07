import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../errorHandler";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, userType } = req.body;

  const errors: string[] = [];

  if (!userType) {
    errors.push("User type is required");
  } else {
    if (userType !== "admin" && userType !== "user") {
      errors.push("Invalid user type. Allowed values: 'admin', 'user'");
    }
  }

  if (!name) {
    errors.push("Name is required");
  } else {
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      errors.push("Name must contain only letters and numbers");
    }
  }

  if (!email) {
    errors.push("Email is required");
  } else {
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Invalid email format");
    }
  }

  if (!password) {
    errors.push("Password is required");
  } else {
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
  }

  if (errors.length) {
    const errorMessage=errors.map(err => err).join(', ');
    return next(errorHandler(400,errorMessage));
  }
console.log(req.body);

  next();
};

export const validateUserSelf = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  const errors: string[] = [];


  if (!name) {
    errors.push("Name is required");
  } else {
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      errors.push("Name must contain only letters and numbers");
    }
  }

  if (!email) {
    errors.push("Email is required");
  } else {
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Invalid email format");
    }
  }

  if (!password) {
    errors.push("Password is required");
  } else {
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
  }

  if (errors.length) {
    const errorMessage=errors.map(err => err).join(', ');
    return next(errorHandler(400,errorMessage));
  }
console.log(req.body);

  next();
};

