import mongoose from "mongoose";

const deliveryPointSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
});

const departurePointSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
});

const productCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, trim: true },
  pricePerKilo: { type: Number, required: true }, 
});

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true},
  description: { type: String, requiered: true, trim: true},
  color: { type: String, requiered: true, trim: true},
})
const paymentMethodSchema= mongoose.Schema({
  name: { type: String, required: true, trim: true},
})
const configSchema = new mongoose.Schema(
  {
    deliveryPoints: [deliveryPointSchema],
    departurePoints: [departurePointSchema],
    productCategories: [productCategorySchema],
    paymentMethods:[paymentMethodSchema],
    states: [stateSchema],
    iva: { type: Number, required: true },
    packagingCost: { type: Number, required: true },
    customsDuty: { type: Number, required: true,},  
    insurance: { type: Number, required: true, },  
    otherTaxes: { type: Number, required: true, },
  },
  { timestamps: true },
);


const DeliveryPoint = mongoose.model("DeliveryPoint", deliveryPointSchema);
const DeparturePoint = mongoose.model("DeparturePoint", departurePointSchema);
const ProductCategory = mongoose.model("ProductCategory", productCategorySchema);
const State = mongoose.model("State", stateSchema);
const PaymentMethod = mongoose.model("PaymentMethod",paymentMethodSchema);
const Config = mongoose.model("Config", configSchema);


// Exportación de todos los modelos
export { DeliveryPoint, DeparturePoint, ProductCategory, State, PaymentMethod, Config};
