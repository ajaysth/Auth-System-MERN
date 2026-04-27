import jwt from "jsonwebtoken";

const userAuth =async (req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(decoded){
            req.userId = decoded.id;

        }else{
            return res.status(401).json({message:"Unauthorized"});
        }
        next();

    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }

}

export default userAuth;