import express from "express";
import { banUser, createUser, createUserSelf, deleteUser, getAllUsers, getUserById, updateUser, updateUserSelf } from "../controllers/userController";
import { isAdmin, isUser } from "../utility/middleware/authHandler";
import { userPictureUpload } from "../utility/fileUpload";
import { checkQuerygetUsers, createUserCheck, createUserSelfCheck } from "../utility/middleware/validators/userValidation";
const router = express.Router();

router.post("/admin/register",createUserCheck,isAdmin, createUser);
router.get("/all",isAdmin,checkQuerygetUsers,getAllUsers);
router.put("/admin/:id",isAdmin,updateUser);
router.get("/:id",isAdmin,getUserById);
router.delete("/:id",isAdmin,deleteUser);
router.post("/register",userPictureUpload.single('userPicture'),createUserSelfCheck, createUserSelf);
router.put("/:id",isUser,updateUserSelf);
router.put("/admin/ban/:id",isAdmin,banUser);



export default router;
