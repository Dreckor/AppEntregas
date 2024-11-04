import { Router } from 'express'
import { authRequired, checkAdmin } from '../middlewares/validateToken.js'
import {

    getConfig,
    updateConfig,
    deleteConfigOption
} from '../controllers/config.controller.js'


const router = Router();

router.get("/config", authRequired,getConfig)
router.put("/config", authRequired,checkAdmin,updateConfig)
router.delete("/config", authRequired,checkAdmin,deleteConfigOption)

export default router