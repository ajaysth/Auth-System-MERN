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

        

        const user = await userModel({
            name,
            email,
            password:hashedpassword
        })

        
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000
        })

        return res.status(201).json({message:"User registered successfully",token:token})


    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

const login = async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:"Please fill all the fields"});
    }

    try{
        const user = await userModel.findOne({
            email:email
        })
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.status(400).json({message:"Invalid Password"});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({message:"Login successful",token:token})




    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }

}

const logout = async (req,res)=>{
    try{
        res.clearCookie("token",{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        return res.status(200).json({message:"Logout successful"})
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}





export {register, login,logout}