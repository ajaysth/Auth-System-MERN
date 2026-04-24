import express from "express";
import cors from "cors";
import "dotenv/config" 
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB.js";


//Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes//userRoutes.js"

const app = express();
app.use(cors({credentials:true}));
app.use(express.json());
app.use(cookieParser());
connectDB();
app.use("/api/auth",authRoutes);
app.use("/api/userData",userRoutes);

const PORT = process.env.PORT;

app.get("/",(req,res)=>{
    res.json({message:"Hello from Server"});
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})