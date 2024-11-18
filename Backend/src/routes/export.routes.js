import express from "express";
import {  exportOrdersToCSV } from "../controllers/export.controller.js";

const router = express.Router();

router.get("/export-csv", exportOrdersToCSV);

export default router;