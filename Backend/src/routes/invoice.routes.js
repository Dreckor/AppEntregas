import { Router } from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  updateInvoiceStatus,
  cancelInvoice,
} from '../controllers/invoice.controller.js'


const router = Router();

router.get("/invoices", authRequired,getAllInvoices)
router.get("/invoice/:id", getInvoiceById)
router.post("/invoice", authRequired,createInvoice)
router.put("/invoice/:id", authRequired,updateInvoiceStatus)
router.put("/cancel/invoice/:id", authRequired,cancelInvoice)

export default router