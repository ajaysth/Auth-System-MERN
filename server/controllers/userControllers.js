import userModel from "../models/userModel.js";

const getUserData = async(req,res)=>{
    const {userId}= req;

    if(!userId){
        return res.status(400).json({message:"Please provide user ID"});
    }
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        return res.json({
            success:true,
            userData:{
                name:user.name,
                email:user.email,
                isAccountVerified:user.isAccountVerified}
        })
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

export {getUserData}