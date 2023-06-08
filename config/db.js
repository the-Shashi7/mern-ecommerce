import mongoose from 'mongoose';

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`DB is connected ${conn.connection.host} `.bgGreen)
    } catch (error) {
        console.log("Error in db connection".bgRed.white,error)
    }
}

export default connectDB;