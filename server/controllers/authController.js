import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req,res)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"Please fill all the fields"});
    }
    try{
        const existingUser = await userModel.findOne({email:email})

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedpassword = await bcrypt.hash(password,10);

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        const user = await userModel({
            name,
            email,
            password:hashedpassword
        })

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
        })
        await user.save();

        res.status(201).json({message:"User registered successfully"})


    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

export {register}