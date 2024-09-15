import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {
    orderTitle: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
    },
    initialPoint: {
        type: String,
        required: true,
    },
    destinyPoint: {
        type: String,
        required: true,
    },
    trakingNumber: {
      type: String,
      required: true,
      trim: true,
    },
    products: [
      {
        productLabel: { type: String, required: true },
        productUnits: { type: Number, required: true },
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
    history: [
      {
        stateLabel: { type: String, required: true },
        startedDate: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
