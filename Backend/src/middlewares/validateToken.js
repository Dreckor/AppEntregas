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

export const checkAdmin = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };