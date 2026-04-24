import express from "express";
import { register, login,logout,sendVerifyEmail,verifyEmail,isAuthenticated,sendResetOtp,resetPassword } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();




router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.post("/send-verify-email",userAuth,sendVerifyEmail)
router.post("/verify-email",userAuth,verifyEmail)
router.post("/isAuthenticated",userAuth,isAuthenticated)
router.post("/send-reset-otp",sendResetOtp)
router.post("/reset-password",resetPassword)

export default router;