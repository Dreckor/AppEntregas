import { Router } from 'express'
import { authRequired,checkAdmin } from '../middlewares/validateToken.js'
import {
    getOrder,
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder
} from '../controllers/orders.controler.js'
import upload from '../middlewares/upload.js';


const router = Router();

router.get("/orders", authRequired,getOrders)
router.get("/order/:trakingNumber", getOrder)
router.post("/order", authRequired, checkAdmin,createOrder)
router.put("/order/:id", authRequired,upload, updateOrder)
router.delete("/order/:id", authRequired,checkAdmin,deleteOrder)

export default router