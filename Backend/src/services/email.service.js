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
        subject: `Nueva Orden Creada: ${trakingNumber}`,
        html: `
            <div style='display: flex;flex-direction: column;justify-content: center;align-items: center;margin-top: 2vw;padding: 3vw;
            text-align: center;height: auto;background-color: #fff;border-radius: 1vw;font-size: 1vw;width: auto;min-width: 25vw;max-width: 30vw; background-color:rgb(250, 250, 250);'>
            <h2 style='font-size: 1.5vw;margin-bottom: 1vw;margin-top: 0;font-family: Bebas Neue, sans-serif;font-weight: 400;color: #19bf66;'>Detalles de la Orden</h2>
            <p style='text-align: center;font-size: .8vw;color: #585858;font-weight: 400;font-family: Rubik, sans-serif;border-radius: 1vw;'><b>Título:</b> ${orderTitle}</p>
            <p style='text-align: center;font-size: .8vw;color: #585858;font-weight: 400;font-family: Rubik, sans-serif;border-radius: 1vw;'><b>Número de seguimiento:</b> ${trakingNumber}</p>
            <p style='text-align: center;font-size: .8vw;color: #585858;font-weight: 400;font-family: Rubik, sans-serif;border-radius: 1vw;'><b>Cliente:</b> ${user.username} (${user.username})</p>
            <p style='text-align: center;font-size: .8vw;color: #585858;font-weight: 400;font-family: Rubik, sans-serif;border-radius: 1vw;'><b>Punto de destino:</b> ${destinyPoint.name}</p>
            <p style='text-align: center;font-size: .8vw;color: #585858;font-weight: 400;font-family: Rubik, sans-serif;border-radius: 1vw;'><b>Total:</b> $${totalCost}</p>
            <h3 style='text-align: center;font-size: .8vw;color: #585858;font-weight: 400;font-family: Rubik, sans-serif;border-radius: 1vw;'>Productos:</h3>
            <ul style='text-align: center;font-size: .8vw;color: #585858;font-weight: 400;font-family: Rubik, sans-serif;border-radius: 1vw;'>
                ${products.map(product => `<li>${product.productLabel} - Cantidad: ${product.productUnits}</li>`).join('')}
            </ul>
            <p style='text-align: center;font-size: .8vw;color: #585858;font-weight: 400;font-family: Rubik, sans-serif;border-radius: 1vw;'><b>Puedes seguir tu paquete haciendo click en el enlace:</b> 
              <a href="${FRONTEND_URL + '/order/' + trakingNumber}">
                 Seguir mi paquete
                </a>
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado correctamente');
    } catch (error) {
        console.error('Error enviando el correo:', error);
    }
};
