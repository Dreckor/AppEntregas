import { useEffect } from "react";
import OrdersList from '../components/helpers/OrdersList';
import { useOrders } from "../context/OrderContext";
import { Button} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from "../context/DashboardContext";


function OrdersPage() {
  const navigate = useNavigate();
  const { fetchOrders, orders } = useOrders();
  const { exportOrders } = useDashboard();
  useEffect(() => {
    fetchOrders()
    
  }, []);

  const handleExport = () =>{
    exportOrders()
  }
  return (
    <div className="listadorde">
      <h1>Listado de Órdenes</h1>
      <Button type="primary" onClick={() => navigate('/createorder')}>
      Crear nueva orden
      </Button>
      <Button type="secondary" onClick={handleExport}>
      Exportar datos
      </Button>
      <br></br>
      <OrdersList orders={orders} />
    </div>
  );
}

export default OrdersPage;
