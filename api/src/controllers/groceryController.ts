import { NextFunction, Request, Response } from "express";
import GroceryItem from "../models/GroceryItem";
import { errorHandler } from "../utility/middleware/errorHandler";
import { Op } from "sequelize";

const createGrocery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const groceryItem = await GroceryItem.create(req.body);
    res.status(201).json(groceryItem);
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

    return res.status(400).json({ message: "Error creating grocery" });
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
    const { name, category, price, quantity, description } = req.body;

    const grocery = await GroceryItem.update(
      { name, category, price, quantity, description },
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
    next(errorHandler(500, "Something went wrong"));
    return;
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
export {
  createGrocery,
  getAllGrocery,
  getGroceryByName,
  getGroceryById,
  updateGroceryItem,
  deleteGroceryItem,
  changeGroceryQuantity,
};
