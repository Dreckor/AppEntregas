import { Router } from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import {
    getOrder,
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder
} from '../controllers/orders.controler.js'


const router = Router();

router.get("/order", authRequired,getOrders)
router.get("/order:trakingNumber", getOrder)
router.post("/order", authRequired,createOrder)
router.put("/order", authRequired,updateOrder)
router.delete("/order:id", authRequired,deleteOrder)

export default router