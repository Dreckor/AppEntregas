import { useEffect } from "react";
import OrdersList from '../components/helpers/OrdersList';
import { useOrders } from "../context/OrderContext";
import { Button} from 'antd';
import { useNavigate } from 'react-router-dom';


function OrdersPage() {
  const navigate = useNavigate();
  const { fetchOrders, orders } = useOrders();
  useEffect(() => {
    fetchOrders()
    
  }, []);

  return (
    <div className="listadorde">
      <h1>Listado de Órdenes</h1>
      <Button type="primary" onClick={() => navigate('/createorder')}>
      Crear nueva orden
      </Button>
      <br></br>
      <OrdersList orders={orders} />
    </div>
  );
}

export default OrdersPage;
