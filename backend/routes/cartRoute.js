import express from "express"
import { addToCart, getUserCart, upadateCart } from "../controllers/cartController.js"
import authUser from "../middleware/auth.js"


const cartRouter = express.Router()

cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, upadateCart)
cartRouter.post('/get', authUser, getUserCart)




export default cartRouter