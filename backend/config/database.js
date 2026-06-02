import mongoose from "mongoose";
const connectDB=async()=>{
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('DataBase Connected')
    }).catch((err)=>{
        console.error('Error connecting to DataBase:', err);
    })
}
export default connectDB;