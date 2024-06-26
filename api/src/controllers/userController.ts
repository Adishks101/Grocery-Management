import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { errorHandler } from "../utility/middleware/errorHandler";
import { removeFile } from "../utility/fileUpload";
import {
  updateUserSchema,
  updateUserSchemaSelf,
  userSchema,
  userSchemaSelf,
} from "../utility/middleware/validators/userValidation";
import { Op } from "sequelize";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = req.body;
    if (req.file) {
      data = await adduserPicture(req.body, req.file);
    }
    const newUser = await User.create(data);
    res.status(201).json(newUser);
  } catch (error) {
    if (req.file) {
      removeFile(req.file, "User");
    }
    console.log("Error creating user", error);
    return next(errorHandler(400, "Error creating user"));
  }
};

const createUserSelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data = req.body;
    if (req.file) {
      data = await adduserPicture(req.body, req.file);
    }
    const newUser = await User.create(data);
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error Creating user self", error);

    if (req.file) {
      removeFile(req.file, "User");
    }
    return next(errorHandler(400, "Error creating user"));
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    let data = req.body;
    const { error } = updateUserSchema.validate(data);
    if (error) {
      const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(errorHandler(400, errorMessages));    }
    if (req.file) {
      data = await adduserPicture(req.body, req.file);
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    await user.update(data);

    res.status(200).json({
      message: "Updated user",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (req.file) {
      removeFile(req.file, "User");
    }
    return next(errorHandler(500, "Error updating user"));
  }
};

const updateUserSelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.cookies.user.id;
    let data = req.body;
    const { error } = updateUserSchemaSelf.validate(data);
    if (error) {
      const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(errorHandler(400, errorMessages));    }
    if (req.file) {
      data = await adduserPicture(req.body, req.file);
    }
    const user = await User.update(data, { where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Update user",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (req.file) {
      removeFile(req.file, "User");
    }
    return next(errorHandler(500, "Error updating user"));
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    await user.softDelete();
    res.status(200).json({
      message: "User deleted",user
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return next(errorHandler(500, "Error deleting user"));
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, userType, status, name, gender } = req.query;
    const filter: any = {};
    if (userType) filter.userType = userType;
    if (status) filter.status = status;
    if (name) filter.name = { [Op.like]: `%${name}%` };
    if (gender) filter.gender = gender;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await User.findAndCountAll({
      where: filter,
      offset,
      limit: Number(limit),
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return next(errorHandler(500, "Error fetching users"));
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));

      return;
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return next(errorHandler(500, "Error fetching user"));
  }
};
const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.cookies.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return next(errorHandler(500, "Error fetching user"));
  }
};
const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    await user.banUser();
    return res.status(200).json({
      message: `User ${user.name} with id ${user.id} banned`,
    });
  } catch (error) {
    console.log("Error banning user:", error);
    return next(errorHandler(500, "Error banning user"));
  }
};

const adduserPicture = async (data: any, file: any) => {
  data.profilePicture = process.env.FILEURL + "upload/userPictureUpload/"+encodeURIComponent(file.filename);
  return data;
};

export {
  createUser,
  createUserSelf,
  updateUserSelf,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getCurrentUser,
  banUser,
};
