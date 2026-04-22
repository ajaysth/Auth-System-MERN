import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        console.log("Connecting to database...")

        await mongoose.connection.on("connected",()=>console.log("Connected to database"))
        await mongoose.connect(`${process.env.MONGO_URL}/mern-auth`);
        
    }catch(error){
        console.log(error);
    }
}

export default connectDB;