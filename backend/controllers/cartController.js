import userModel from "../models/userModel.js"


// add cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, color } = req.body
        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                if (cartData[itemId][size][color]) {
                    cartData[itemId][size][color] += 1;
                } else {
                    cartData[itemId][size][color] = 1;
                }
            } else {
                cartData[itemId][size] = { [color]: 1 };
            }
        } else {
            cartData[itemId] = {
                [size]: {
                    [color]: 1
                }
            };
        }
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Ajouté au panier" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}


// updatecart
const upadateCart = async (req, res) => {
    try {
        const { userId, itemId, size, color, quantity } = req.body

        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData
        cartData[itemId][size][color] = quantity
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Panier mis à jour" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// user cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData
        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addToCart, upadateCart, getUserCart }
