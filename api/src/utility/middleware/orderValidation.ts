import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";
import GroceryItem from "../../models/GroceryItem";

const orderValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groceryItems, totalAmount, totalItems } = req.body;
    if (!groceryItems || !totalAmount || !totalItems) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (isNaN(totalAmount) || isNaN(totalItems)) {
      return next(
        errorHandler(400, "Total amount and total items must be numbers")
      );
    }
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (!decimalRegex.test(totalAmount)) {
      return next(errorHandler(400, "Price must be a decimal number"));
    }
    if (totalItems < 1) {
      return next(errorHandler(400, "Total items must be greater than 0"));
    }
    if (groceryItems.length < 1) {
      return next(errorHandler(400, "Grocery items must not be empty"));
    }
    const groceryCheck = await groceryQuantityCheck(groceryItems);
    if (groceryCheck.length > 0) {
      return next(errorHandler(400, groceryCheck.toString()));
    }
    next();
  } catch (error) {
    console.log(error);
    return next(errorHandler(400, "Invalid request"));
  }
};

const groceryQuantityCheck = async (
  groceryList: { id: number; quantity: number }[]
): Promise<{ message: string }[]> => {
  const errorMessage = [];
  try {
    const groceryListArray = Array.from(groceryList);
    for (const item of groceryListArray) {
      const { id, quantity } = item;
      const groceryItem = await GroceryItem.findByPk(id);
      if (!groceryItem) {
        errorMessage.push({ message: `Grocery item with ${id} not found` });
      } else if (quantity > groceryItem.quantity) {
        errorMessage.push({
          message: `Grocery item quantity for ${groceryItem.name} is ${groceryItem.quantity} not sufficient`,
        });
      }
    }
    return errorMessage;
  } catch (error) {
    console.log(error);
    return [...errorMessage, { message: "Invalid request" }];
  }
};

export{orderValidator};
