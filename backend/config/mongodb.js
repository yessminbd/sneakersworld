import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        const mongoUrl = process.env.MONGO_URL;
        console.log("MONGO_URL exists:", !!mongoUrl);
        if (!mongoUrl) {
            throw new Error("MONGO_URL is not defined in .env file");
        }

        const db = await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.error("=> Vérifiez: 1) Votre IP dans Atlas Network Access, 2) Cluster non pausé, 3) MONGO_URL correct dans .env");
    }
};

export default connectDB;
