import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userControllers.js";

const router = express.Router();

router.get("/",userAuth,getUserData)

export default router;