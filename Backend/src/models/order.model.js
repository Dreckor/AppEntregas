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
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
