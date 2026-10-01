import express from "express"
import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"
import { createPromo, listPromos, updatePromo, deletePromo, applyPromo } from "../controllers/promoController.js"

const promoRouter = express.Router()

// Admin routes
promoRouter.post("/create", adminAuth, createPromo)
promoRouter.get("/list", adminAuth, listPromos)
promoRouter.put("/update/:id", adminAuth, updatePromo)
promoRouter.delete("/delete/:id", adminAuth, deletePromo)

// Client route (authentifié)
promoRouter.post("/apply", authUser, applyPromo)

export default promoRouter
