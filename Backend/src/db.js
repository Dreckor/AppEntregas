import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
export const connectdb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conexión exitosa")
  } catch (error) {
    console.log(error);
  }
};
