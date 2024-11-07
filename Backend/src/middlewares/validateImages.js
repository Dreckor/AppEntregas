import fs from 'fs';
import path from 'path';
import Order from '../models/order.model.js';

export const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) return resolve(); // Si no existe, no hace nada

            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Error al eliminar el archivo: ${unlinkErr}`);
                    return reject(unlinkErr);
                }
                resolve();
            });
        });
    });
};

export const replaceFilesMiddleware = async (req, res, next) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.files?.evidencePhoto && order.evidencePhoto) {
            await deleteFile(path.resolve(order.evidencePhoto));
        }

        if (req.files?.clientSignature && order.clientSignature) {
            await deleteFile(path.resolve(order.clientSignature));
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error en el middleware de reemplazo de archivos', error });
    }
};
