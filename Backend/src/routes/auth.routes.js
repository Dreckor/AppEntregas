import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { verifytoken } from "../controllers/auth.controller.js";
import { login, logout, register, profile, getUsersByRole } from "../controllers/auth.controller.js";

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.post('/auth/verify' , verifytoken) 

router.get('/profile', authRequired ,profile)

router.get('/users', authRequired ,getUsersByRole)

export default router;