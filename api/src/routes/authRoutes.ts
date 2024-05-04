import express from "express";
import { signIn } from "../controllers/authController";
const router = express.Router();

router.post("/sign-in", signIn);


export default router;
