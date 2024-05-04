import { Request, Response, NextFunction } from "express";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, userType } = req.body;

  const errors: string[] = [];

  if (!userType) {
    errors.push("User type is required");
  } else {
    if (userType !== "admin" && userType !== "user") {
      errors.push("Invalid user type. Allowed values: 'admin', 'user'");
    }
  }

  if (!username) {
    errors.push("Username is required");
  } else {
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      errors.push("Username must contain only letters and numbers");
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
    return res.status(422).json({
      message: "Validation failed",
      errors,
    });
  }
console.log(req.body);

  next();
};
