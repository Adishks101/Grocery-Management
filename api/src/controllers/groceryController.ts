import { NextFunction, Request, Response } from "express";
import GroceryItem from "../models/GroceryItem";
import { errorHandler } from "../utility/middleware/errorHandler";

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
