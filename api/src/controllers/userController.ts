import express, { NextFunction, Request, Response } from "express";
import User from "../models/User";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, userType } = req.body;
    const newUser = await User.create({ username, email, password, userType });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal Server Error");
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
    let { pgSize, offset } = req.query;

    const pageSize = parseInt(pgSize as string, 10) || 10;
    const offsetValue = parseInt(offset as string, 10) || 0;
    const users = await User.findAll({ limit: pageSize, offset: offsetValue });

    res.status(200).json({ users });
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
