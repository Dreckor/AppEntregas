import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AppEntregas");
    console.log("Conexión exitosa")
  } catch (error) {
    console.log(error);
  }
};
