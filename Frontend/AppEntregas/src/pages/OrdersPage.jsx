import { useEffect } from "react";
import OrdersList from '../components/helpers/OrdersList';
import { useOrders } from "../context/OrderContext";


function OrdersPage() {
 
  const { fetchOrders, orders } = useOrders();
  useEffect(() => {
    fetchOrders()
    
  }, []);

  return (
    <div className="listadorde">
      <h1>Listado de Órdenes</h1>
      <OrdersList orders={orders} />
    </div>
  );
}

export default OrdersPage;
