import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utility/middleware/errorHandler";
import Order from "../models/Order";
import User from "../models/User";
import GroceryItem from "../models/GroceryItem";
import OrderItem from "../models/OrderItem";

const addOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.cookies.user.id;
    const { groceryItems, totalAmount, totalItems } = req.body;

    const order = await createOrder({
      userId,
      totalAmount,
      totalItems,
      orderDate: Date.now(),
    });
    const orderItems = await createOrderItems(groceryItems, order.id);
    res.status(200).json({
      message: "order added successfully",
      data: { order, orderItems },
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
      include: [{ model: User, as: "user" }],
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
    const order = (await Order.findByPk(orderId, {
      include: [
        { model: User, as: "user" },
        { model: GroceryItem, as: "groceryItems" },
      ],
    })) as Order;

    if (!order) {
      next(errorHandler(404, "Order not found"));
      return;
    }
    if (
      order &&
      (req.cookies.user.id === order.user?.id ||
        req.cookies.user.userType === "admin")
    ) {
      res.status(200).json({ data: order });
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

const createOrder = async (data: any) => {
  try {
    return await Order.create(data);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error; 
  }
};

const createOrderItems = async (data: any, orderId: number) => {
  try {
    const orderItems = data.map(
      async (groceryItem: { id: number; quantity: number }) => {
        const orderItem = await OrderItem.create({
          orderId: orderId,
          groceryItemId: groceryItem.id,
          quantity: groceryItem.quantity,
        });
        const grocery = await GroceryItem.findByPk(groceryItem.id);
        await grocery?.updateQuantity(groceryItem.quantity);
        return orderItem;
      }
    );
    return await Promise.all(orderItems);
  } catch (error) {
    console.error("Error creating order items:", error);
    throw error; 
  }
};
export { addOrder, getAllOrder, getOrderById, getOrderByusers, getOwnOrders };
