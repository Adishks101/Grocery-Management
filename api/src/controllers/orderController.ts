import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utility/middleware/errorHandler";
import Order from "../models/Order";
import User from "../models/User";
import GroceryItem from "../models/GroceryItem";

const addOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.cookies.user.id;
    const { groceryItems, totalAmount, totalItems } = req.body;

    const order = await Order.create(
      {
        orderDate: new Date(),
        totalAmount,
        totalItems,
        user: userId,
        groceryItems: groceryItems,
      },
      {
        include: [
          { model: User, as: "user" },
          { model: GroceryItem, as: "groceryItems" },
        ],
      }
    );

    res.status(200).json({
      message: "order added successfully",
      data: order,
    });
  } catch (error) {
    console.log("Couldn't add order", error);
    next(errorHandler(500, "Something went wrong with adding Order"));
    return;
  }
};

const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Order.findAndCountAll({
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
    console.log("Couldn't get all orders", error);
    next(errorHandler(500, "Something went wrong with getting Orders"));
    return;
  }
};

const getOrderByusers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Order.findAndCountAll({
      offset: offset,
      limit: Number(limit),
      include: [
        { model: User, as: "user", where: { id: userId } },
        GroceryItem,
      ],
    });
    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data: rows,
    });
  } catch (error) {
    console.log("Couldn't get all orders", error);
    next(errorHandler(500, "Something went wrong with getting Orders"));
    return;
  }
};

const getOwnOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.cookies.user.id;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Order.findAndCountAll({
      offset: offset,
      limit: Number(limit),
      include: [
        { model: User, as: "user", where: { id: userId } },
        GroceryItem,
      ],
    });
    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data: rows,
    });
  } catch (error) {
    console.log("Couldn't get all orders", error);
    next(errorHandler(500, "Something went wrong with getting Orders"));
    return;
  }
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: "user" },
        { model: GroceryItem, as: "groceryItems" },
      ],
    }) as Order;
    if (!order) {
      next(errorHandler(404, "Order not found"));
      return;
    }
if (order && (req.cookies.user.id === order.user?.id || req.cookies.user.userType === "admin")) {
    res.status(200).json({data:order});
} else {
    next(errorHandler(403, "You are not authorized to view this order"));
    return;
}
  } catch (error) {
    console.log("Couldn't get order", error);
    next(errorHandler(500, "Something went wrong with getting Order"));
    return;
  }
};


export {addOrder,getAllOrder,getOrderById,getOrderByusers,getOwnOrders}