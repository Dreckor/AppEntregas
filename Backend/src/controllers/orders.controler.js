import Order from '../models/order.model.js';
import {DeliveryPoint, DeparturePoint} from '../models/config.model.js';
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
                .populate('assignedTo')
                .populate('initialPoint')
                .populate('destinyPoint')
                .populate('state')
                .populate({
                    path: 'history.stateLabel',
                    model: 'State'
                });
                
        } else {
            // Si el usuario no es un admin, solo obtiene sus propias órdenes
            orders = await Order.find({ assignedTo: req.user._id })
            .populate('user')
            .populate('assignedTo')
            .populate('initialPoint')
            .populate('destinyPoint')
            .populate('state')
            .populate({
                path: 'history.stateLabel',
                model: 'State'
            });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};


export const createOrder = async (req, res) => {
    const { orderTitle, state, userId, initialPoint, destinyPoint, products, asignedUserId, netCost, totalCost, packaging, hasIva, invoice,evidencePhoto = '', clientSignature = '' } = req.body;
    console.log(req.user)
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Solo un usuario administrador puede crear ordenes' });
    }

    try {
        const departure = await DeparturePoint.findById(initialPoint);
        const delivery = await DeliveryPoint.findById(destinyPoint);

        if (!departure || !delivery) {
            return res.status(400).json({ message: 'Puntos de entrega o salida no válidos' });
        }

        const trakingNumberString = `${departure.name.slice(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000000000)}${delivery.name.slice(0, 3).toUpperCase()}`;
        
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
            }],
            netCost,
            totalCost,
            packaging,
            hasIva,
            invoice,
            evidencePhoto, 
            clientSignature

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
        const order = await Order.findOne({ trakingNumber })
        .populate('user')
        .populate('assignedTo')
        .populate('initialPoint')
        .populate('destinyPoint')
        .populate('state')
        .populate({
            path: 'history.stateLabel',
            model: 'State'
        });;

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

    // Obtén la ruta de la foto de evidencia y la firma del cliente
    const evidencePhoto = req.files?.evidencePhoto ? req.files.evidencePhoto[0].path.replace(/\\/g, '/') : null;
    const clientSignature = req.files?.clientSignature ? req.files.clientSignature[0].path.replace(/\\/g, '/') : null;

    try {
        // Encontrar la orden actual
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

         // Verificar el último estado en el historial
         const lastState = order.history.length > 0 ? order.history[order.history.length - 1].stateLabel.toString() : null;
         console.log("last state")
         console.log(lastState)

         // Solo agregar el nuevo estado si es diferente del último estado
         const newState = req.body.state;
         const newStateName = newState._id;
         console.log("new state")
         console.log(newStateName)
         let updatedHistory = [...order.history];
 
         if (newStateName !== lastState) {
             updatedHistory.push({
                 stateLabel: newState,
                 startedDate: new Date(),
             });
         }

        // Crear un objeto para actualizar
        const updatedOrderData = {
            ...req.body,
            history: updatedHistory,
            ...(evidencePhoto && { evidencePhoto }), // Solo agrega si no es null
            ...(clientSignature && { clientSignature }) // Solo agrega si no es null
        };

        // Actualiza la orden
        const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData, { new: true });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.log(error);
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
