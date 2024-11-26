import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products:  [
    {
      productLabel: { type: String, required: true },
      productUnits: { type: Number, required: true },
      productCategory: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory", required: true },
      cost: { type: Number, required: false },
      kilos: { type: Number, required: false },
      largo: {type: Number, required: false},
      ancho: {type: Number, required: false},
      altura: {type: Number, required: false},
      valorDeclarado: {type: Number, required: false},
      tipoDeCobro: { type: String, enum: ["Por peso", "Por volumen"], default: "pending", required: false }
    },
  ],
  packaging:  { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  issueDate: { type: Date, default: Date.now },
  customsDuty: { type: Number, required: true},
  iva: { type: Number, required: true },  
  insurance: { type: Number, required: true, },  
  otherTaxes: { type: Number, required: true, },
  status: { type: String, enum: ["paid", "unpaid", "pending", "cancelled"], default: "pending" },
});

 
export default mongoose.model("Invoice", InvoiceSchema);
