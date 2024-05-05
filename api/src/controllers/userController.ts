import { NextFunction, Request, Response } from "express";
import User from "../models/User";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      return res
        .status(400)
        .json({ message: "Validation failed", errors: validationErrors });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      return res
        .status(400)
        .json({ message: "Validation failed", errors: validationErrors });
    }

    return res.status(400).json({ message: "Error creating user" });
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    const { username, email, password, userType } = req.body;

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.userType = userType || user.userType;

    await user.save();

    res.status(200).json({
      message: "Update user",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    await user.destroy();
    res.status(200).json({
      message: "User deleted",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await User.findAndCountAll({
      offset,
      limit: Number(limit),
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createUser, updateUser, deleteUser, getAllUsers, getUserById };
