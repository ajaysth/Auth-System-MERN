import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

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

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: email,
            subject:"Welcome to our MERN Auth System",
            text:`Hi ${name},\n\nThank you for registering at our MERN Auth System. We're excited to have you on board!\n\nBest regards,\nMERN Auth Team`

        }
        await transporter.sendMail(mailOptions);

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

const sendVerifyEmail = async (req,res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({message:"Account already verified"});
        }

        const otp = String(Math.floor(100000+(Math.random()*900000)))
        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 24*60*60*1000;
        
        await user.save();

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: user.email,
            subject:"Account Verification - MERN Auth System",
            text:`Hi ${user.name},\n\nYour OTP for account verification is: ${otp}. It will expire in 24 hours.\n\nBest regards,\nMERN Auth Team`

        }
        await transporter.sendMail(mailOptions);

        return res.status(200).json({message:"Verification email sent successfully"})

    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}


const verifyEmail = async (req,res)=>{
    const {userId,otp}= req.body;

    if(!userId || !otp){
        return res.status(400).json({message:"Please provide userId and otp"});
    }

    try{
        const user = await userModel.findById(userId);

        if(!user){
            return res.status(400).json({message:"Invalid userId. User not found"});
        }

        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.status(400).json({message:"Invalid OTP"});
        }

        if (user.verifyOtpExpiresAt < Date.now()){
            return res.status(400).json({message:"OTP has expired. Please request a new one."});
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiresAt = 0;

        await user.save();

        return res.status(200).json({message:"Account verified successfully"})

    }catch(error){
    return res.status(500).json({
        message:error.message
    })
}
}

//check wether the user is verified or not
const isAuthenticated =  async (req,res)=>{
    try{
        return res.status(200).json({isAuthenticated:true})
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}





export {register, login,logout,sendVerifyEmail,verifyEmail,isAuthenticated}