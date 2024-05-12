import express from "express";
import { banUser, createUser, createUserSelf, deleteUser, getAllUsers, getCurrentUser, getUserById, updateUser, updateUserSelf } from "../controllers/userController";
import { isAdmin, isUser } from "../utility/middleware/authHandler";
import { userPictureUpload } from "../utility/fileUpload";
import { checkQuerygetUsers, createUserCheck, createUserSelfCheck } from "../utility/middleware/validators/userValidation";
const router = express.Router();

router.post("/admin/register",userPictureUpload.single('userPicture'),createUserCheck,isAdmin, createUser);
router.get("/admin/all",isAdmin,checkQuerygetUsers,getAllUsers);
router.put("/admin/:id",isAdmin,updateUser);
router.get("/admin/:id",isAdmin,getUserById);
router.get("/self",isUser,getCurrentUser)
router.delete("/admin/:id",isAdmin,deleteUser);
router.post("/register",userPictureUpload.single('userPicture'),createUserSelfCheck, createUserSelf);
router.put("/self",isUser,updateUserSelf);
router.put("/admin/ban/:id",isAdmin,banUser);



export default router;
