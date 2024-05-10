import { NextFunction, Request, Response } from "express";
import GroceryItem from "../models/GroceryItem";
import { errorHandler } from "../utility/middleware/errorHandler";
import { Op } from "sequelize";
import { groceryItemSchema } from "../utility/middleware/validators/groceryValidation";
import { removeFile } from "../utility/fileUpload";

const createGrocery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data = req.body;
    if (req.file) {
      data = await addgroceryPicture(req.body, req.file);
    }
    const groceryItem = await GroceryItem.create(data);
    res.status(201).json(groceryItem);
  } catch (error) {
      console.log("Error creating Grocery item: " , error)
      if (req.file) {
        removeFile(req.file, "User");
      }
    return next(errorHandler(400, "Error creating Grocery item"));
  }
};

const getAllGrocery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await GroceryItem.findAndCountAll({
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
    console.error("Error getting grocery items:", error);
    next(errorHandler(500, "Something went wrong"));
    return;
  }
};

const getGroceryByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await GroceryItem.findAndCountAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
    });

    if (!rows) {
      next(errorHandler(404, "Grocery item not found"));
      return;
    }

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data: rows,
    });
  } catch (error) {
    console.error("Error getting grocery item by name:", error);
    next(errorHandler(500, "Something went wrong"));
    return;
  }
};

const getGroceryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const groceryItem = await GroceryItem.findOne({ where: { id } });

    if (!groceryItem) {
      next(errorHandler(404, "Grocery item not found"));
      return;
    }

    res.status(200).json(groceryItem);
  } catch (error) {
    console.error("Error getting grocery item by id:", error);
    next(errorHandler(500, "Something went wrong"));
    return;
  }
};

const updateGroceryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    let data = req.body;
    if (req.file) {
      data = await addgroceryPicture(req.body, req.file);
    }
    const grocery = await GroceryItem.update(
      data,
      { where: { id } }
    );

    if (!grocery[0]) {
      next(errorHandler(404, "Grocery item not found"));
      return;
    }

    res.status(200).json({
      message: "Grocery item updated successfully",
      data: grocery,
    });
  } catch (error) {
    console.error("Error updating grocery item:", error);
    if (req.file) {
      removeFile(req.file, "User");
    }
    return next(errorHandler(500, "Something went wrong"));
  }
};

const deleteGroceryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const grocery = await GroceryItem.findByPk(id);

    if (!grocery) {
      next(errorHandler(404, "Grocery item not found"));
      return;
    }
    grocery.softDelete();
    res.status(200).json({ message: `${grocery.name} deleted successfully` });
  } catch (error) {
    console.error("Error deleting grocery item:", error);
    next(errorHandler(500, "Something went wrong deleting"));
    return;
  }
};
const changeGroceryQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const grocery = await GroceryItem.findByPk(id);
    if (!grocery) {
      next(errorHandler(404, "Grocery item not found"));
      return;
    }
    grocery.addQuantity(quantity);
    res.status(200).json({
      message: "Updated Grocery item successfully",
      data: grocery,
    });
  } catch (error) {
    console.error("Error updating grocery item:", error);
    next(errorHandler(500, "Something went wrong"));
    return;
  }
};

const addgroceryPicture = async (data: any, file: any) => {
  data.profilePicture = process.env.URL + file.path;
  return data;
};

export {
  createGrocery,
  getAllGrocery,
  getGroceryByName,
  getGroceryById,
  updateGroceryItem,
  deleteGroceryItem,
  changeGroceryQuantity,
};
