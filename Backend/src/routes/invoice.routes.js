import { Router } from 'express'
import { authRequired,checkAdmin } from '../middlewares/validateToken.js'
import {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  updateInvoiceStatus,
  cancelInvoice,
} from '../controllers/invoice.controller.js'


const router = Router();

router.get("/invoices", authRequired,checkAdmin,getAllInvoices)
router.get("/invoice/:id", authRequired,checkAdmin, getInvoiceById)
router.post("/invoice", authRequired,checkAdmin,createInvoice)
router.put("/invoice/:id", authRequired,checkAdmin,updateInvoiceStatus)
router.put("/cancel/invoice/:id", authRequired,checkAdmin,cancelInvoice)

export default router