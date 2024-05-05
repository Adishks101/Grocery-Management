import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";
import { validateUser } from "../utility/middleware/userValidation";
import { isAdmin } from "../utility/middleware/authHandler";
const router = express.Router();

router.post("/register",validateUser, createUser);
router.get("/all",getAllUsers);
router.put("/:id",validateUser,updateUser);
router.get("/:id",getUserById);
router.delete("/:id",isAdmin,deleteUser);



export default router;
