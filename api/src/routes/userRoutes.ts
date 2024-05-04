import express from "express";
import { createUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";
import { validateUser } from "../utility/middleware/userValidation";
const router = express.Router();

router.post("/register",validateUser, createUser);
router.get("/all",getAllUsers);
router.put("/:id",validateUser,updateUser);
router.get("/:id",getUserById);


export default router;
