import express from "express";
import {
  groceryCreateCheck,
  groceryQuantityCheck,
  groceryUpdateCheck,
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
import { groceryPictureUpload } from "../utility/fileUpload";

const router = express.Router();

router.post("/add",groceryPictureUpload.single('groceryPicture'),isAdmin,groceryCreateCheck,createGrocery);
router.get("/all", isUser, getAllGrocery);
router.get("/search",isUser,getGroceryByName);
router.get("/:id", isUser, getGroceryById);
router.put("/:id", groceryPictureUpload.single('groceryPicture'),isAdmin,groceryUpdateCheck, updateGroceryItem);
router.delete("/:id", isAdmin, deleteGroceryItem);
router.put("/add-quantity", isAdmin,groceryQuantityCheck,changeGroceryQuantity);

export default router;
