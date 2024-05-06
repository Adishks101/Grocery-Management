import express from "express";
import { isAdmin, isUser } from "../utility/middleware/authHandler";
import {
  addOrder,
  getAllOrder,
  getOrderById,
  getOrderByusers,
  getOwnOrders,
} from "../controllers/orderController";
import { orderValidator } from "../utility/middleware/orderValidation";

const router = express.Router();

router.post("/add", isUser,orderValidator, addOrder);
router.get("/all", isAdmin, getAllOrder);
router.get("/search", isAdmin, getOrderByusers);
router.get("/own", isUser, getOwnOrders);
router.get("/:id", isUser, getOrderById);

export default router;