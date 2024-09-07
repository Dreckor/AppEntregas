import Order from '../models/order.model.js';
import User from '../models/user.model.js';


export const getOrders = async (req, res) => {
    try {
        let orders;

        if (req.user.role === 'admin') {
            orders = await Order.find().populate('user');
        } else {
            
            orders = await Order.find({ user: req.user._id }).populate('user');
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};


export const createOrder = async (req, res) => {
    const { orderTitle, state, userId, initialPoint, destinyPoint, products, asignedUserId } = req.body;
    console.log(req.user)
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Solo un usuario administrador puede crear ordenes' });
    }

    try {
        const trakingNumberString = initialPoint.slice(0,3) +Math.floor((Math.random(  ) * 1000000000 ))+ destinyPoint.slice(0,3) 
        const newOrder = new Order({
            orderTitle,
            state,
            trakingNumber: trakingNumberString,
            user: userId,
            initialPoint,
            destinyPoint,
            products,
            assignedTo: asignedUserId

        });

        const savedOrder = await newOrder.save();
        await User.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });
        await User.findByIdAndUpdate(asignedUserId, { $push: { asignedOrders: savedOrder._id } });

        res.status(201).json(savedOrder);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creando orden', error });
    }
};


export const getOrder = async (req, res) => {
    const { trackingNumber } = req.params;

    try {
        const order = await Order.findOne({ trackingNumber });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving the order', error });
    }
};


export const updateOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
            new: true, 
        });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
};


export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};
