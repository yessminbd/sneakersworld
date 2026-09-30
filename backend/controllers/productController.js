import productModel from "../models/productModel.js"
import { v2 as cloudinary } from "cloudinary"

// ajouter produit
const addProduct = async (req, res) => {
    try {

        // Récupèrer les champs envoyés 
        const { name, description, price, category, subCategory, sizes, colors, popular } = req.body

        // Récupérer les images 
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        // Eviter les images (ubdefined) => ne sont pas envoyées
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        // Uploader chaque image vers Cloudinary
        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                //item.path => chemin local de l'image
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                // Récupèrer les URLs finales hébergées sur Cloudinary
                return result.secure_url
            }))

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            popular: popular === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            colors: JSON.parse(colors),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData)
        const product = new productModel(productData)
        await product.save()
        res.json({ success: true, message: "Produit ajouté" })
    }
    catch (error) {
        res.json({ success: false, message: error.message })

    }

}

// Chercher liste des produits 
const listProduct = async (req, res) => {

    try {
        const products = await productModel.find({})
        console.log(products)
        res.json({ success: true, products })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Supprimer un produit 
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Produit supprimé" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Chercher un produit
const singleProduct = async (req, res) => {

    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })
        console.log(product)
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { addProduct, listProduct, removeProduct, singleProduct }