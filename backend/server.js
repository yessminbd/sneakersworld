import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
// App config
const app = express()
const port = process.env.PORT || 4000


// Middleware
app.use(express.json()) // Pour lire le JSON dans les requêtes POST
app.use(cors())         // Autoriser les appels depuis d'autres domaines (ex: React)

connectDB()
connectCloudinary()

// API route
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


app.get('/', (req, res) => {
    res.send("API is working")
})

// Démarrage du serveur
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log("Server is running on port: " + port));
}

export default app;
