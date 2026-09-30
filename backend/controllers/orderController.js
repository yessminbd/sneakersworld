import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"


// variables for payment
const currency = 'USD'
const delivery_charges = 7


// stripe initials
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// place order (cash)
const placeOrder = async (req, res) => {

    try {
        const { userId, items, amount, address } = req.body
        const orderData = {
            userId,
            items, amount, paymentMethod: 'COD', address,
            payment: false,
            date: Date.now()

        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: 'Commande passée avec succès' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}


// add order strip
const placeOrderStrip = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body
        const { origin } = req.headers

        const orderData = {
            userId,
            items, amount, paymentMethod: 'STRIPE', address,
            payment: false,
            date: Date.now()

        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => (
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100 * 277
                },
                quantity: item.quantity
            }))
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Prix de livraison"
                },
                unit_amount: delivery_charges * 100 * 277
            },
            quantity: 1
        })
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            mode: 'payment'
        })
        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//verifier stripe methode
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: true })

        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// all orders admin
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// all order user
const userOrders = async (req, res) => {

    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }

}

// update Status admin
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Statut mis à jour" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, placeOrderStrip, allOrders, userOrders, updateStatus, verifyStripe }