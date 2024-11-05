import { Router } from "express";
import { authRequired, checkAdmin } from "../middlewares/validateToken.js";
import { verifytoken } from "../controllers/auth.controller.js";
import { login, logout, register, profile, getUsersByRole, updateUser, deleteUser, crearUsuario } from "../controllers/auth.controller.js";

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.post('/auth/verify' , verifytoken) 

router.get('/profile', authRequired ,profile)

router.get('/users', authRequired ,getUsersByRole)

router.post('/users', authRequired,checkAdmin, crearUsuario)
router.put('/users/:id', authRequired,checkAdmin, updateUser);
router.delete('/users/:id', authRequired, checkAdmin,deleteUser);

export default router;