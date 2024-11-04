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

export const crearUsuario = async (req, res, next) => {
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
            email: userFound.email,
            role: userFound.role
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
          email: userFound.email,
          role: userFound.role
        })
      })
    } catch (error) {
      
    }
} 

export const getUsersByRole = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "repartidor") {
    return res
      .status(403)
      .json({ message: "Solo un usuario administrador puede listar usuarios" });
  }
  try {
   
    const users = await User.find({ role: { $in: ["user", "repartidor", "admin"] } });

    const usersData = {
      users: users
        .filter((user) => user.role === "user")
        .map((user) => ({ username: user.username, id: user._id, email: user.email, role: user.role, address: user.address })),

      repartidores: users
        .filter((user) => user.role === "repartidor")
        .map((user) => ({ username: user.username, id: user._id, email:user.email, role: user.role, address: user.address })),
      
      administradores: users
        .filter((user) => user.role === "admin")
        .map((user) => ({ username: user.username, id: user._id, email:user.email, role: user.role, address: user.address })),
    };

    return res.json(usersData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, address, role, newPassword } = req.body; // Aceptar newPassword en la solicitud

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only an admin can update users" });
  }

  try {
    // Preparar los datos a actualizar
    const updateData = { username, email, address, role };

    // Si se proporciona una nueva contraseña, encriptarla y agregarla a updateData
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Actualizar el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        address: updatedUser.address,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params;


  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only an admin can delete users" });
  }

  try {
  
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      message: "User deleted successfully",
      userId: deletedUser._id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};