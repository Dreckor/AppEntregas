import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: { 
        type: String, 
        enum: ['admin', 'user', 'repartidor'], 
        required: true 
    },address: { type: String, required: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    asignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    invoices: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true }
}, {timestamps:true})

export default mongoose.model('User', userSchema);