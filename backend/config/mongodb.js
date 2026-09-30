import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

        const db = await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 10000,
        });

        isConnected = db.connections[0].readyState;

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    }
};

export default connectDB;
