import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { errorHandler } from "../errorHandler";
import GroceryItem from "../../../models/GroceryItem";
import { Status } from "../../customDatatypes";
import { Op } from "sequelize";

const groceryItemSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().precision(2).positive().required(),
  quantity: Joi.number().integer().positive().required(),
  description: Joi.string().required(),
  status: Joi.string().valid(...Object.values(Status)),
  
});

const querySchema = Joi.object({
  name: Joi.string(),
  category: Joi.string(),
  price: Joi.number()
    .precision(2)
    .positive(),
  quantity: Joi.number()
    .positive(),
  status: Joi.string()
    .valid(...Object.values(Status)),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
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
const groceryCreateCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = groceryItemSchema.validate(req.body);
  if (error) {
    const errorMessages = error.details
    .map((detail) => detail.message)
    .join(", ");
  return next(errorHandler(400, errorMessages));  }
  const { name } = req.body;
  const existingItem = await GroceryItem.findOne({ where: { name } });
  if (existingItem) {
    return next(
      errorHandler(400, "Grocery item with this name already exists")
    );
  }
  next();
};
const groceryUpdateCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = groceryItemSchema.validate(req.body);
  if (error) {
    const errorMessages = error.details
    .map((detail) => detail.message)
    .join(", ");
  return next(errorHandler(400, errorMessages));  }
  const { id } = req.params;
  const { quantity, name } = req.body;
  const existingItem = await GroceryItem.findByPk(id);
  if (!existingItem) {
    next(errorHandler(400, "Grocery Item not found"));
    return;
  }
  const nameExist = await GroceryItem.findOne({
    where: { name, id: { [Op.not]: id } },
  });
  if (nameExist) {
    return next(
      errorHandler(400, "Grocery item with this name already exists")
    );
  }
  if (isNaN(Number(quantity))) {
    next(errorHandler(400, "Quantity must be numbers"));
    return;
  }

  next();
};
const checkGetAllGrocery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = querySchema.validate(req.query);
    if (error) {
      const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(errorHandler(400, errorMessages));    }
    next();
  } catch (error) {
    return next(
      errorHandler(400, "Please check the query params and try again")
    );
  }
};
export {
  groceryQuantityCheck,
  groceryItemSchema,
  groceryCreateCheck,
  groceryUpdateCheck,
  checkGetAllGrocery,
};
