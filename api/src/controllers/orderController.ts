import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utility/middleware/errorHandler";
import Order from "../models/Order";
import User from "../models/User";
import GroceryItem from "../models/GroceryItem";
import OrderItem from "../models/OrderItem";
import { Op } from "sequelize";

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
    const { page = 1, limit = 10,startDate,endDate,to } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const filter: any = {};
    if (startDate && endDate) {
    try { filter.orderDate = {
        [Op.between]: [new Date(String(startDate)), new Date(String(endDate))],
      };}
      catch{
        return next(errorHandler(400, "startDate and endDate should be valid date format"));
      }
    }
    const { count, rows } = await Order.findAndCountAll({
      offset,
      limit: Number(limit),
      include: [{ model: User, as: "user" }],
    });
const data= await getAllGroceryItems(rows);
    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data,
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
    if (!userId) {
      next(errorHandler(400, "Please provide a user ID"));
    }
    const { count, rows } = await Order.findAndCountAll({
      offset: offset,
      limit: Number(limit),
      include: [
        { model: User, as: "user", where: { id: userId } },
        
      ],
    });
    const data=await getAllGroceryItems(rows)

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data,
    });
  } catch (error) {
    console.log("Couldn't get all orders by user", error);
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
    });

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

const getAllGroceryItems = async (data: Order[]) => {
  try {
    const addedData = await Promise.all(
      data.map(async (orderItem: any) => {
        const groceryItem = await OrderItem.findOne({
          where: { orderId: orderItem.id },      include: [{ model: GroceryItem, as: "groceryItem" }],

        });
        if (groceryItem) {
          orderItem.items = groceryItem;
        } else {
          orderItem.items = null;
        }
        return orderItem;
      })
    );
    return addedData;
  } catch (error) {
    console.error("Error fetching grocery items:", error);
    throw new Error("Error fetching grocery items");
  }
};

export { addOrder, getAllOrder, getOrderById, getOrderByusers, getOwnOrders };
