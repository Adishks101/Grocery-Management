import express from "express";
import { isAdmin, isUser } from "../utility/middleware/authHandler";
import {
  addOrder,
  getAllOrder,
  getOrderById,
  getOrderByusers,
  getOwnOrders,
} from "../controllers/orderController";
import { orderQueryValidator, orderValidator } from "../utility/middleware/validators/orderValidation";

const router = express.Router();

router.post("/add", isUser,orderValidator, addOrder);
router.get("/all", isAdmin,orderQueryValidator, getAllOrder);
router.get("/user/:id", isAdmin, getOrderByusers);
router.get("/self", isUser, getOwnOrders);
router.get("/:id", isUser, getOrderById);

export default router;