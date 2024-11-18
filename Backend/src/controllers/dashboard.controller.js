import Order from "../models/order.model.js";
import { State, ProductCategory } from "../models/config.model.js";
import moment from "moment";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;


// Función para calcular el porcentaje de cambio y la tendencia
const calculateChange = (previous, current) => {
  if (previous === 0) {
    return {
      percentage: current > 0 ? 100 : 0,
      trend: current > 0 ? "up" : "down",
    };
  }
  const change = ((current - previous) / previous) * 100;
  return {
    percentage: Math.abs(change.toFixed(2)),
    trend: change > 0 ? "up" : "down",
  };
};

// Función para construir filtros
const buildFilters = ({ dateRange, assignedTo, state }) => {
  const filters = { $and: [] };

  if (dateRange && dateRange.length === 2) {
    const [startDate, endDate] = dateRange;
    filters.$and.push({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
  }

  if (assignedTo && ObjectId.isValid(assignedTo)) {
    filters.$and.push({ assignedTo: new ObjectId(assignedTo) });
  }

  if (state && ObjectId.isValid(state)) {
    filters.$and.push({ state: new ObjectId(state) });
  }

  // Si no hay filtros, eliminar $and para evitar una consulta vacía incorrecta
  if (filters.$and.length === 0) {
    delete filters.$and;
  }

  return filters;
}

// Función para obtener el total de órdenes
const getTotalOrders = async ( filters,lastWeekFilters) => {
  const totalOrders = await Order.countDocuments(filters);
  const totalOrdersLastWeek = await Order.countDocuments(lastWeekFilters);
  const change = calculateChange(totalOrdersLastWeek, totalOrders);

  return {
    count: totalOrders,
    change: change.percentage,
    trend: change.trend,
  };
};

// Función para obtener órdenes recientes
const getRecentOrders = async (lastWeekFilters) => {
  const recentOrders = await Order.find(lastWeekFilters).populate("state");
  return { recentOrders };
};

// Función para obtener los ingresos totales
const getTotalRevenue = async (filters, lastWeekFilters) => {
  const [currentRevenue] = await Order.aggregate([
    { $match: filters },
    { $group: { _id: null, totalRevenue: { $sum: "$totalCost" } } },
  ]);

  const [lastWeekRevenue] = await Order.aggregate([
    { $match: lastWeekFilters },
    { $group: { _id: null, totalRevenue: { $sum: "$totalCost" } } },
  ]);

  const totalRevenue = currentRevenue?.totalRevenue || 0;
  const totalRevenueLastWeek = lastWeekRevenue?.totalRevenue || 0;
  const change = calculateChange(totalRevenueLastWeek, totalRevenue);

  return {
    amount: totalRevenue,
    change: change.percentage,
    trend: change.trend,
  };
};

// Función para obtener órdenes activas (excepto "Entregado")
const getActiveDeliveries = async (filters, lastWeekFilters) => {
  const deliveredState = await State.findOne({ label: "Entregado" });

  const activeFilters = { ...filters };
  if (deliveredState) {
    activeFilters.state = { $ne: deliveredState._id };
  }

  const activeDeliveries = await Order.countDocuments(activeFilters);
  const activeDeliveriesLastWeek = await Order.countDocuments({
    ...lastWeekFilters,
    state: { $ne: deliveredState?._id },
  });

  const change = calculateChange(activeDeliveriesLastWeek, activeDeliveries);

  return {
    count: activeDeliveries,
    change: change.percentage,
    trend: change.trend,
  };
};

// Función para obtener la distribución de estados de órdenes
const getOrderStateDistribution = async (filters) => {
  return await Order.aggregate([
    { $match: filters },
    {
      $lookup: {
        from: "states",
        localField: "state",
        foreignField: "_id",
        as: "stateInfo",
      },
    },
    { $unwind: "$stateInfo" },
    {
      $group: { _id: "$stateInfo.name", count: { $sum: 1 } },
    },
    { $project: { state: "$_id", value: "$count", _id: 0 } },
  ]);
};

// Función para obtener la distribución de categorías de productos
const getProductCategoryDistribution = async (filters) => {
  return await Order.aggregate([
    { $match: filters },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "productcategories",
        localField: "products.productCategory",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $group: { _id: "$categoryInfo.categoryName", count: { $sum: 1 } },
    },
    { $project: { category: "$_id", value: "$count", _id: 0 } },
  ]);
};

// Controlador para obtener los datos del dashboard con filtros
export const getDashboardStats = async (req, res) => {
  try {
    const { dateRange, assignedTo, state } = req.query;

    const filters = buildFilters({ dateRange, assignedTo, state });

    const startOfLastWeek = moment().subtract(1, "week").startOf("isoWeek").toDate();
    const endOfLastWeek = moment().subtract(1, "week").endOf("isoWeek").toDate();

    const lastWeekFilters = {
      ...filters,
      createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
    };

    const [totalOrders, totalRevenue, activeDeliveries, orderStateDistribution, productCategoryDistribution, recentOrders] = await Promise.all([
      getTotalOrders(filters, lastWeekFilters),
      getTotalRevenue(filters, lastWeekFilters),
      getActiveDeliveries(filters, lastWeekFilters),
      getOrderStateDistribution(filters),
      getProductCategoryDistribution(filters),
      getRecentOrders(lastWeekFilters)
    ]);

    res.status(200).json({
      totalOrders,
      totalRevenue,
      activeDeliveries,
      orderStateDistribution,
      productCategoryDistribution,
      recentOrders
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
