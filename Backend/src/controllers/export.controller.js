import Order from "../models/order.model.js";
import { createObjectCsvWriter } from "csv-writer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportOrdersToCSV = async (req, res) => {
  try {
    // Asegurar que el directorio de exportación existe
    const exportDir = path.join(__dirname, "../../exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const orders = await Order.find()
      .populate('state')
      .populate('initialPoint')
      .populate('destinyPoint')
      .populate('user')
      .populate('assignedTo')
      .populate('paymentMethod')
      .populate('invoice');

    const csvWriter = createObjectCsvWriter({
      path: path.join(exportDir, "orders.csv"),
      header: [
        { id: "_id", title: "OrderID" },
        { id: "orderTitle", title: "Titulo de la orden" },
        { id: "initialPoint", title: "Punto de partida" },
        { id: "destinyPoint", title: "Punto de destino" },
        { id: "clientName", title: "Cliente" },
        { id: "assignedTo", title: "Repartidor" },
        { id: "state", title: "Estado" },
        { id: "paymentMethod", title: "Metodo de Pago" },
        { id: "totalCost", title: "Costo Total" },
        { id: "invoiceNumber", title: "Factura" },
        { id: "packaging", title: "Costo de Empaque" },
        { id: "totalAmount", title: "Monto Total" },
        { id: "taxAmount", title: "Impuesto" },
        { id: "netAmount", title: "Monto Neto" },
        { id: "issueDate", title: "Fecha de Emisión" },
        { id: "status", title: "Estado de Factura" },
        { id: "createdAt", title: "Fecha de Creación" },
        { id: "updatedAt", title: "Fecha de Actualización" },
        { id: "products", title: "Productos" },
      ],
    });

    const csvData = orders.map((order) => ({
      _id: order._id.toString(),
      orderTitle: order.orderTitle,
      initialPoint: order.initialPoint
        ? `${order.initialPoint.name} (${order.initialPoint.address})`
        : "Punto de partida eliminado",
      destinyPoint: order.destinyPoint
        ? `${order.destinyPoint.name} (${order.destinyPoint.address})`
        : "Punto de destino eliminado",
      clientName: order.user ? order.user.username : "Usuario eliminado",
      assignedTo: order.assignedTo ? order.assignedTo.username : "Repartidor eliminado",
      state: order.state ? order.state.name : "Estado eliminado",
      paymentMethod: order.paymentMethod ? order.paymentMethod.name : "Método no definido",
      totalCost: order.totalCost,
      invoiceNumber: order.invoice ? order.invoice.invoiceNumber : "Sin factura",
      packaging: order.invoice ? order.invoice.packaging : "No disponible",
      totalAmount: order.invoice ? order.invoice.totalAmount : "No disponible",
      taxAmount: order.invoice ? order.invoice.taxAmount : "No disponible",
      netAmount: order.invoice ? order.invoice.netAmount : "No disponible",
      issueDate: order.invoice ? order.invoice.issueDate.toISOString() : "No disponible",
      status: order.invoice ? order.invoice.status : "No disponible",
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      products: order.products
        .map((product) =>
          `Nombre: ${product.productLabel}, Unidades: ${product.productUnits}, Kilos: ${product.kilos}, Costo: ${product.cost}`
        )
        .join(" | "),
    }));

    await csvWriter.writeRecords(csvData);
    const filePath = path.join(exportDir, "orders.csv");
    const fileStream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error al exportar órdenes a CSV:", error);
    res.status(500).json({ error: "Error al exportar órdenes" });
  }
};
