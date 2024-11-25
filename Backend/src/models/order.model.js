import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {
    orderTitle: {
      type: String,
      required: true,
      trim: true,
    },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    initialPoint: { type: mongoose.Schema.Types.ObjectId, ref: "DeparturePoint", required: true },
    destinyPoint:{ type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPoint", required: true },
    trakingNumber: {
      type: String,
      required: true,
      trim: true,
    }, 
    products: [
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
    history: [
      {
        stateLabel: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
        startedDate: { type: Date, required: true }
      },
    ],
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod",
      required: true,
    },
    netCost: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    packaging:  { type: Boolean, required: true },
    hasIva: { type: Boolean, required: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    customsDuty: { type: Number, required: true},
    iva: { type: Number, required: true },  
    insurance: { type: Number, required: true, },  
    otherTaxes: { type: Number, required: true, },
    evidencePhoto: {
      type: String,
      required: false,
    },
    clientSignature: {
      type: String, 
      required: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
