import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import configRoutes from './routes/config.routes.js'

import { FRONTEND_URL } from './config.js';

const app = express()

app.use(cors(
    {origin: FRONTEND_URL, credentials:true}
))
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())

app.use('/api',authRoutes);
app.use('/api', ordersRoutes);
app.use('/api', configRoutes);

if (process.env.NODE_ENV === "production") {
  console.log("prod env")
    app.use(express.static("Frontend/AppEntregas/dist"));

    app.get("*", (req, res) => {
      console.log(path.resolve("Frontend", "AppEntregas", "dist", "index.html"));
      res.sendFile(path.resolve("Frontend", "AppEntregas", "dist", "index.html"));
    });
}

export default app;