import mongoose from "mongoose";

// Cache the connection promise across serverless invocations (Vercel)
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    // Return existing connection immediately
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error("MONGO_URL is not defined in environment variables");
    }

    // Re-use in-flight connection promise if already connecting
    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: false, // ← Désactive le buffering pour forcer une erreur explicite
        }).then((m) => {
            console.log("MongoDB connected successfully");
            return m;
        }).catch((err) => {
            cached.promise = null; // Reset so the next request retries
            console.error("MongoDB connection failed:", err.message);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
};

export default connectDB;

