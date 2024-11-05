import { createContext, useState, useContext } from "react";
import { 
  createOrderRequest, 
  getOrdersRequest, 
  getOrderRequest, 
  updateOrderRequest, 
  deleteOrderRequest 
} from '../api/orders';


export const OrderContext = createContext();


export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};


export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrdersRequest();

      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  
  const createOrder = async (order) => {
    setLoading(true);
    try {
      const res = await createOrderRequest(order);
      setOrders([...orders, res.data]); 
    } catch (err) {
      setError(err.response?.data?.message || "Error creating order");
    } finally {
      setLoading(false);
    }
  };

  
  const getOrder = async (trackingNumber) => {
    setLoading(true);
    try {
      const res = await getOrderRequest(trackingNumber);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching the order");
    } finally {
      setLoading(false);
    }
  };

 

  
  const updateOrder = async (id, updatedOrder) => {
    setLoading(true);
    try {
      const res = await updateOrderRequest(id, updatedOrder);
      setOrders(orders.map((order) => (order._id === id ? res.data : order))); 
    } catch (err) {
      setError(err.response?.data?.message || "Error updating the order");
    } finally {
      setLoading(false);
    }
  };

 
  const deleteOrder = async (id) => {
    setLoading(true);
    try {
      await deleteOrderRequest(id);
      setOrders(orders.filter((order) => order._id !== id)); 
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting the order");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <OrderContext.Provider 
      value={{ 
        orders, 
        loading, 
        error, 
        fetchOrders, 
        createOrder, 
        getOrder, 
        updateOrder, 
        deleteOrder 
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
