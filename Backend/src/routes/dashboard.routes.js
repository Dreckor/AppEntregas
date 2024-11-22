import { Router } from 'express'
import { authRequired, checkAdmin } from '../middlewares/validateToken.js'
import {
    getDashboardStats
} from '../controllers/dashboard.controller.js'


const router = Router();

router.get("/dashboard", authRequired,checkAdmin,getDashboardStats)


export default router