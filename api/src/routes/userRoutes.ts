import express from "express";
import { banUser, createUser, createUserSelf, deleteUser, getAllUsers, getUserById, updateUser, updateUserSelf } from "../controllers/userController";
// import { validateUpdateUser, validateUpdateUserSelf, validateUser, validateUserSelf } from "../utility/middleware/validators/userValidation";
import { isAdmin, isUser } from "../utility/middleware/authHandler";
import { userPictureUpload } from "../utility/fileUpload";
const router = express.Router();

router.post("/admin/register",isAdmin, createUser);
router.get("/all",isAdmin,getAllUsers);
router.put("/admin/:id",isAdmin,updateUser);
router.get("/:id",isAdmin,getUserById);
router.delete("/:id",isAdmin,deleteUser);
router.post("/register",userPictureUpload.single('userPicture'), createUserSelf);
router.put("/:id",isUser,updateUserSelf);
router.put("/admin/ban/:id",isAdmin,banUser);



export default router;
