import express from "express";
import cors from "cors";
import "dotenv/config" 

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT;

app.get("/",(req,res)=>{
    res.json({message:"Hello World"});
})

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})