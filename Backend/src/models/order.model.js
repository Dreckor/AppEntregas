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
        cost: { type: Number, required: true },
        kilos: { type: Number, required: true },
        largo: {type: Number, required: true},
        ancho: {type: Number, required: true},
        altura: {type: Number, required: true},
        tipoDeCobro: { type: String, enum: ["Por peso", "Por volumen"], default: "pending" }
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
