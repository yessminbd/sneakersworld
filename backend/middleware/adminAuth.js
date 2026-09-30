import jwt from "jsonwebtoken"
const adminAuth = async (req, res, next) => {

    try {
        // Récupère le token envoyé dans les headers HTTP de la requête
        const { token } = req.headers

        // Si aucun token n'est envoyé, renvoie un message d'erreur
        if (!token) {
            res.json({ success: false, message: "Non autorisé" })
        }

        // Vérifie et décode le token JWT avec la clé secrète
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        //  Compare le contenu du token déchiffré avec l'email + mot de passe de l'admin dans les variables d'environnement
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASS) {
            return res.json({ success: false, message: 'Accès non autorisé, merci de réessayer plus tard' })
        }

        // Si tout est OK, passe au middleware ou route suivant
        next()
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}
export default adminAuth