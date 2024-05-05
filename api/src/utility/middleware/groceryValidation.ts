import { Request, Response, NextFunction } from "express";
import GroceryItem from "../../models/GroceryItem";
import { errorHandler } from "./errorHandler";

const validateGroceryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, category, price, quantity, description } = req.body;

    if (!name || !category || !price || !quantity) {
      next(errorHandler(400, "All fields are required"));
      return;
    }

    if (isNaN(Number(price)) || isNaN(Number(quantity))) {
      next(errorHandler(400, "Price and quantity must be numbers"));
      return;
    }
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (!decimalRegex.test(price)) {
        next(errorHandler(400, "Price must be a decimal number"));
      return;
    }

    next();
  } catch (error) {
    console.error("Error validating grocery item:", error);
    next(errorHandler(400, "Error validating GroceryItem"));
    return;
  }
};
const groceryAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const existingItem = await GroceryItem.findOne({ where: { name } });
  if (existingItem) {
    next(errorHandler(400, "Grocery item with this name already exists"));
    return;
  }
};

const groceryQuantityCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const existingItem = await GroceryItem.findByPk(id);
  if (!existingItem) {
    next(errorHandler(400, "Grocery Item not found"));
    return;
  }
  if ( isNaN(Number(quantity))) {
    next(errorHandler(400, "Quantity must be numbers"));
    return;
  }
  
  next();
};
export { validateGroceryItem, groceryAlreadyExists,groceryQuantityCheck };
