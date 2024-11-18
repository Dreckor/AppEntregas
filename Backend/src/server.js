import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import configRoutes from './routes/config.routes.js'
import invoiceRoutes from './routes/invoice.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import exportRoutes from './routes/export.routes.js'

import { FRONTEND_URL } from './config.js';

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(
    {origin: FRONTEND_URL, credentials:true}
))
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')), (req, res, next) => {
  next();
});

app.use('/api',authRoutes);
app.use('/api', ordersRoutes);
app.use('/api', configRoutes);
app.use('/api', invoiceRoutes);
app.use('/api/', dashboardRoutes);
app.use('/api/', exportRoutes);

if (process.env.NODE_ENV === "production") {
  console.log("prod env")
    app.use(express.static("Frontend/AppEntregas/dist"));

    app.get("*", (req, res) => {
      console.log(path.resolve("Frontend", "AppEntregas", "dist", "index.html"));
      res.sendFile(path.resolve("Frontend", "AppEntregas", "dist", "index.html"));
    });
}

export default app;