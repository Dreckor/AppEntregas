import User from "../models/user.model.js";
import { createAccessToken } from "../libs/jwt.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from "../config.js";


export const register = async (req, res, next) => {
  const { email, password, username, address, role } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      address,
      role
    });

    const savedUser = await newUser.save();
    const token = await createAccessToken({id: savedUser._id})
    
    res.cookie('token', token);
    res.json({"message":"Registrado con exito", "User": {
      'id': savedUser._id,
      'username': savedUser.username,
      'email': savedUser.email
    }});
  } catch (error) {
    res.status(500).json({message: error.message})
  }
  
  
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
        return res.status(400).json({
            success: false,
            errorCode: 'USER_NOT_FOUND',
            message: "No existe este usuario"
        });
    }

    const isCorrect = await bcrypt.compare(password, userFound.password);
    if (!isCorrect) {
        return res.status(400).json({
            success: false,
            errorCode: 'INVALID_CREDENTIALS',
            message: "Credenciales incorrectas"
        });
    }

    const token = await createAccessToken({ id: userFound._id });

    res.cookie('token', token);
    return res.json({
        success: true,
        message: "Logeado con éxito",
        user: {
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        }
    });
} catch (error) {
    return res.status(500).json({
        success: false,
        errorCode: 'SERVER_ERROR',
        message: "Ocurrió un error en el servidor"
    })
  }
  
  
};

export const logout =  (req, res) =>{
  res.cookie('token', '',{expires: new Date(0)})
  return res.sendStatus(200)
}

export const profile = async (req, res)=>{
  const userFound = await User.findById(req.user.id)
  if(!userFound) return res.status(400).json({message: "User not found"})
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    role: userFound.role,
    orders: userFound.orders,
    asignedOrders: userFound.asignedOrders
  })
}

export const verifytoken = async (req, res) =>{
  const { token } = req.cookies

  if(!token) return res.status(401).json({ message: 'No autenticado '})
    try {
      jwt.verify(token, TOKEN_SECRET, async (err, user)=>{
        if(err) return res.status(401).json({ message: 'No autenticado '})
        const userFound = await User.findById(user.id)
        if(!userFound) return res.status(401).json({ message: 'No autenticado '})

        return res.json({
          id: userFound.id,
          username: userFound.username,
          email: userFound.email
        })
      })
    } catch (error) {
      
    }
} 