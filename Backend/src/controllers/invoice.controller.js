import Invoice from '../models/invoice.model.js'
import User from '../models/user.model.js'
import {Config} from '../models/config.model.js'

// Create new invoice
export const createInvoice = async (req, res) => {
  try {
    const {  products, packaging, hasIva, userId, totalCost, netCost } = req.body;
    const config = await Config.findOne();
    const taxPrice = hasIva && config.iva ? netCost * (config.iva / 100) : 0;
    const packagingPrice = packaging && config.packaging ? config.packaging : 0;
    const invoiceNumber = await Invoice.estimatedDocumentCount() + 1;

    const newInvoice = new Invoice({
      invoiceNumber,
      customer: userId,
      products,
      totalAmount: totalCost,
      taxAmount: taxPrice,
      packaging: packagingPrice,
      netAmount: netCost,
    });

    const savedInvoice = await newInvoice.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.updateOne({ $push: { invoices: savedInvoice._id } });
    return res.status(201).json(newInvoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating invoice" });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
                          .populate("customer")
                          .populate("products.productCategory");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    return res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching invoice" });
  }
};

// Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
                           .populate("customer")
                           .populate("products.productCategory");
    return res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching invoices" });
  }
};

// Update invoice status
export const updateInvoiceStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    invoice.status = req.body.status;
    await invoice.save();
    return res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating invoice status" });
  }
};

// Delete an invoice
export const cancelInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    invoice.status = "cancelled";
    await invoice.save();
    return res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error cancelando la factura" });
  }
};

