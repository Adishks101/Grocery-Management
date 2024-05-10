import {Request,Response, NextFunction } from "express";
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
  status: Joi.string()
    .valid(...Object.values(Status)),
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
const groceryCreateCheck= async (req: Request, res: Response, next: NextFunction)=>{
  const {error}=groceryItemSchema.validate(req.body)
    if(error){
      return next(errorHandler(400,error.details[0].message));
    }
    const { name } = req.body;
    const existingItem = await GroceryItem.findOne({ where: { name } });
    if (existingItem) {
      return next(
        errorHandler(400, "Grocery item with this name already exists")
      );
    }
    next();
}
const groceryUpdateCheck=async(req:Request,res:Response,next:NextFunction)=>{
  const {error}=groceryItemSchema.validate(req.body)
    if(error){
      return next(errorHandler(400,error.details[0].message));
    }
  const { id } = req.params;
  const { quantity,name } = req.body;
  const existingItem = await GroceryItem.findByPk(id);
  if (!existingItem) {
    next(errorHandler(400, "Grocery Item not found"));
    return;
  }
  const nameExist = await GroceryItem.findOne({ where: { name ,id:{[Op.not]:id}} });
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
}
export {
  groceryQuantityCheck,
  groceryItemSchema,groceryCreateCheck,groceryUpdateCheck
};
