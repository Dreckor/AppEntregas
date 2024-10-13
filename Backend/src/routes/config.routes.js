import { Router } from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import {

    getConfig,
    updateConfig,
    deleteConfigOption
} from '../controllers/config.controller.js'


const router = Router();

router.get("/config", authRequired,getConfig)
router.put("/config", authRequired,updateConfig)
router.delete("/config", authRequired,deleteConfigOption)

export default router