import {Request,Response, NextFunction } from "express";
import Joi from "joi";
import { errorHandler } from "../errorHandler";
import GroceryItem from "../../../models/GroceryItem";

const groceryItemSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().precision(2).positive().required(),
  quantity: Joi.number().integer().positive().required(),
  description: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .required(),
});

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
  if (isNaN(Number(quantity))) {
    next(errorHandler(400, "Quantity must be numbers"));
    return;
  }

  next();
};
export {
  groceryQuantityCheck,
  groceryItemSchema,
};
