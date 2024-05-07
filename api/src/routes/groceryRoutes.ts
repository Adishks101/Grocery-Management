import express from "express";
import {
  groceryAlreadyExists,
  groceryQuantityCheck,
  validateGroceryItem,
} from "../utility/middleware/validators/groceryValidation";
import {
    changeGroceryQuantity,
  createGrocery,
  deleteGroceryItem,
  getAllGrocery,
  getGroceryById,
  getGroceryByName,
  updateGroceryItem,
} from "../controllers/groceryController";
import { isAdmin, isUser } from "../utility/middleware/authHandler";
const router = express.Router();

router.post(
  "/add",
  isAdmin,
  validateGroceryItem,
  groceryAlreadyExists,
  createGrocery
);
router.get("/all", isUser, getAllGrocery);
router.get("/search",isUser,getGroceryByName);
router.get("/:id", isUser, getGroceryById);
router.put("/:id", isAdmin, updateGroceryItem);
router.delete("/:id", isAdmin, deleteGroceryItem);
router.put("/add-quantity", isAdmin,groceryQuantityCheck,changeGroceryQuantity);

export default router;
