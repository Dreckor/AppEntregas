import User from "../models/user.model.js";
import { createAccessToken } from "../libs/jwt.js";
import bcrypt from 'bcryptjs';


export const register = async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      email,
      password: passwordHash,
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
    const userFound = await User.findOne({email})
    if(!userFound) return res.status(400).json({message: "No existe este usuario"})

    const isCorrect = await bcrypt.compare(password, userFound.password)
    if(!isCorrect) return res.status(400).json({message: "Credenciales incorrectas"})
    
    const token = await createAccessToken({id:userFound._id})
    
    res.cookie('token', token);
    res.json({"message":"Logeado con exito", "User": {
      'id': userFound._id,
      'username': userFound.username,
      'email': userFound.email
    }});
  } catch (error) {
    res.status(500).json({message: error.message})
  }
  
  
};

export const logout =  (req, res) =>{
  res.cookie('token', '',{expires: new Date(0)})
  return res.sendStatus(200)
}

export const profile = (req, res)=>{
  const userFound = User.findById(req.user.id)
  if(!userFound) return res.status(400).json({message: "User not found"})
  res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email
  })
}