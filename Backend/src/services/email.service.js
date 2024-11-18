import { EMAIL_PASS, EMAIL_USER, FRONTEND_URL } from '../config.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes cambiar el servicio según tu proveedor (por ejemplo, 'yahoo', 'hotmail', etc.)
    auth: {
        user: EMAIL_USER, // Tu correo electrónico
        pass: EMAIL_PASS  // Tu contraseña o App Password (recomendado para mayor seguridad)
    }
});

// Función para enviar un correo electrónico
export const sendOrderEmail = async (orderDetails) => {
    const { orderTitle, trakingNumber, user, assignedTo, initialPoint, destinyPoint, products, totalCost } = orderDetails;

    const mailOptions = {
        from: EMAIL_USER,
        to: user.email, // Correo del usuario que creó la orden
        subject: `Nueva Orden Creada: ${orderTitle}`,
        html: `
            <h2>Detalles de la Orden</h2>
            <p><b>Título:</b> ${orderTitle}</p>
            <p><b>Número de seguimiento:</b> ${trakingNumber}</p>
            <p><b>Cliente:</b> ${user.username} (${user.username})</p>
            <p><b>Punto de destino:</b> ${destinyPoint.name}</p>
            <p><b>Total:</b> $${totalCost}</p>
            <h3>Productos:</h3>
            <ul>
                ${products.map(product => `<li>${product.productLabel} - Cantidad: ${product.productUnits}</li>`).join('')}
            </ul>
            <p><b>Puedes seguir tu paquete haciendo click en el enlace:</b> 
              <a href="${FRONTEND_URL + '/order/' + trakingNumber}">
                 Seguir mi paquete
                </a>
                </p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado correctamente');
    } catch (error) {
        console.error('Error enviando el correo:', error);
    }
};
