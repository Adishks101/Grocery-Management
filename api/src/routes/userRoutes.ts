import express, { Request, Response } from "express";
import { createUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", createUser);
router.get("/all",getAllUsers);
router.put("/:id",updateUser);
router.get("/:id",getUserById);


export default router;
