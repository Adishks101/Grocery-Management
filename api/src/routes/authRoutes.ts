import express from "express";
import { rotateToken, signIn } from "../controllers/authController";
const router = express.Router();

router.post("/sign-in", signIn);
router.post("/refresh-token", rotateToken)


export default router;
