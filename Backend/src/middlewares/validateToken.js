import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token)
        return res.status(401).json({message: "Debes autenticarte primero"})
    try {
        const user = jwt.verify(token, TOKEN_SECRET)
        const userFound = await User.findById(user.id)

        if(!userFound) return res.status(401).json({message: "El usuario no existe"})
        req.user = userFound
        next()
    } catch (error) {
        return res.status(401).json({message: "Autenticacion fallida", "error": error})
    }
    
    
}