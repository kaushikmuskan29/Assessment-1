import mongoose from "mongoose";

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb Connected");
    }
    catch(err){
        console.log("MongoDB not conneted", err.message);
        process.exit(1);
    }
}

export default connectDb;