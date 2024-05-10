import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../errorHandler";
import GroceryItem from "../../../models/GroceryItem";
import Joi from "joi";

const orderSchema = Joi.object({
  groceryItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
      })
    )
    .min(1)
    .required(),
  totalAmount: Joi.number().precision(2).positive().required(),
  totalItems: Joi.number().integer().positive().required(),
});

const querySchema = Joi.object({
  totalItems: Joi.number()
    .integer()
    .min(0)
    .message("Query parameter totalItems must be a non-negative integer."),
  totalAmount: Joi.number()
    .precision(2)
    .message(
      "Query parameter totalAmount must be a decimal with up to 2 decimal places."
    ),
  startDate: Joi.date()
    .iso(),
  endDate: Joi.date()
    .iso(),
});

const orderValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(errorHandler(400, errorMessages));
    }
    const queryError = querySchema.validate(req.query).error;
    if (queryError) {
      const errorMessages = queryError.details
        .map((detail) => detail.message)
        .join(", ");
      return next(errorHandler(400, errorMessages));
    }
    const groceryItems = req.body;
    const groceryCheck = await groceryQuantityCheck(groceryItems);
    if (groceryCheck.length > 0) {
      const errorMessages = groceryCheck
        .map((error) => error.message)
        .join(", ");
      return next(errorHandler(400, errorMessages));
    }

    next();
  } catch (error) {
    console.error(error);
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
        errorMessage.push({ message: `Grocery item with id ${id} not found` });
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

export { orderValidator };
