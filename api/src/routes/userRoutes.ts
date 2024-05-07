import express from "express";
import { createUser, createUserSelf, deleteUser, getAllUsers, getUserById, updateUser, updateUserSelf } from "../controllers/userController";
import { validateUser, validateUserSelf } from "../utility/middleware/validators/userValidation";
import { isAdmin, isUser } from "../utility/middleware/authHandler";
const router = express.Router();

router.post("/admin/register",isAdmin,validateUser, createUser);
router.get("/all",isAdmin,getAllUsers);
router.put("/admin/:id",isAdmin,validateUser,updateUser);
router.get("/:id",isAdmin,getUserById);
router.delete("/:id",isAdmin,deleteUser);
router.post("/register",validateUserSelf, createUserSelf);
router.put("/:id",isUser,validateUserSelf,updateUserSelf);



export default router;
