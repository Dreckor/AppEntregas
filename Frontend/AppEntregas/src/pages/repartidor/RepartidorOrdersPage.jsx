import { useEffect } from "react";
import RepartidorOrdersList from '../../components/helpers/RepartidorOrderList';
import { useOrders } from "../../context/OrderContext";


function RepartidorOrdersPage() {
 
  const { fetchOrders, orders } = useOrders();
  useEffect(() => {
    fetchOrders()
    
  }, []);

  return (
    <div className="listadorde">
      <h1>Ordenes en curso</h1>
      <RepartidorOrdersList orders={orders} />
    </div>
  );
}

export default RepartidorOrdersPage;
