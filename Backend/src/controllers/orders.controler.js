import Order from '../models/order.model.js';
import User from '../models/user.model.js';


export const getOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        let orders;

        if (req.user.role === 'admin') {
            // Si el usuario es un admin, obtenemos todas las órdenes
            orders = await Order.find()
                .populate('user')
                .populate('assignedTo');
        } else {
            // Si el usuario no es un admin, solo obtiene sus propias órdenes
            orders = await Order.find({ user: req.user._id })
                .populate('user')
                .populate('assignedTo');
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
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
            assignedTo: asignedUserId,
            history:[{
                stateLabel: state,
                startedDate: new Date(),
            }]

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
    const { trakingNumber } = req.params;
    
    try {
        const order = await Order.findOne({ trakingNumber });

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
        // Encontrar la orden actual
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Agregar el nuevo estado al historial
        const updatedHistory = [
            ...order.history,
            {
                stateLabel: req.body.state,
                startedDate: new Date(),
            }
        ];

        // Actualizar la orden con el nuevo estado y el historial actualizado
        const updatedOrderData = {
            ...req.body, 
            history: updatedHistory,
        };

        const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData, { new: true });

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
