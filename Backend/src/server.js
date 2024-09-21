import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import cors from 'cors';

import authRoutes from './routes/auth.routes.js'
import ordersRoutes from './routes/orders.routes.js'

import { FRONTEND_URL } from './config.js';

const app = express()

app.use(cors(
    {origin: FRONTEND_URL, credentials:true}
))
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())

app.use('/api',authRoutes);
app.use('/api', ordersRoutes)

if (process.env.NODE_ENV === "production") {
    const path = require("path");  
    app.use(express.static("Frontend/AppEntregas/dist"));

    app.get("*", (req, res) => {
      console.log(path.resolve("Frontend", "AppEntregas", "dist", "index.html"));
      res.sendFile(path.resolve("Frontend", "AppEntregas", "dist", "index.html"));
    });
}

export default app;