import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Descriptions, Button, Input, Select, notification } from 'antd';
import { useOrders } from '../context/OrderContext';
import Seguimiento from '../components/helpers/Seguimiento';
import '../css/OrderDetail.css';
const { Option } = Select;

const OrderDetails = () => {
  const { updateOrder, deleteOrder } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state;

  
  const [orderTitle, setOrderTitle] = useState(order.orderTitle);
  const [state, setState] = useState(order.state);
  const [initialPoint, setInitialPoint] = useState(order.initialPoint);
  const [destinyPoint, setDestinyPoint] = useState(order.destinyPoint);
  const trakingNumber = order.trakingNumber;

  const copyToClipboard = () => {
    const url = `${window.location.origin}/order/${trakingNumber}`;
    navigator.clipboard.writeText(url).then(() => {
      notification.success({ message: 'Enlace copiado al portapapeles' });
    }).catch(() => {
      notification.error({ message: 'Error al copiar el enlace' });
    });
  };
  
  const handleUpdate = async () => {
    try {
      const updatedOrder = {
        ...order,
        orderTitle,
        state,
        initialPoint,
        destinyPoint,
        trakingNumber,
      };
      await updateOrder(order._id, updatedOrder);
      notification.success({ message: 'Orden actualizada correctamente' });
      navigate('/orders'); 
    } catch (error) {
      notification.error({ message: 'Error al actualizar la orden' });
    }
  };

  
  const handleDelete = async () => {
    try {
      await deleteOrder(order._id);
      notification.success({ message: 'Orden eliminada correctamente' });
      navigate('/orders'); 
    } catch (error) {
      notification.error({ message: 'Error al eliminar la orden' });
    }
  };

  return (
    <><div className='detallesord'>

      <Descriptions title="Detalles de la Orden" bordered>
        <Descriptions.Item label="Título">
          <Input value={orderTitle} onChange={(e) => setOrderTitle(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          <Select value={state} onChange={(value) => setState(value)}>
            <Option value="Pendiente">Pendiente</Option>
            <Option value="Entregado">Entregado</Option>
            <Option value="En camino">En camino</Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="Punto Inicial">
          <Input value={initialPoint} onChange={(e) => setInitialPoint(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Destino">
          <Input value={destinyPoint} onChange={(e) => setDestinyPoint(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Número de Seguimiento">
          {trakingNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Productos">
          {order.products.length > 0 ? (
            <ul>
              {order.products.map((product, index) => (
                <li key={index}>
                  {product.productLabel} - Unidades: {product.productUnits}
                </li>
              ))}
            </ul>
          ) : (
            'Sin productos'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Cliente">Cliente: {order.user.username}, Direccion: {order.user.address}</Descriptions.Item>
        <Descriptions.Item label="Repartidor">Repartidor: {order.assignedTo.username}, Direccion: {order.assignedTo.address}</Descriptions.Item>
      </Descriptions>

      <Seguimiento history={order.history} />
    </div>
      <div className='detailsbt'>

        <Button className="Botondetails" type="primary" onClick={handleUpdate} style={{ marginRight: 10 }}>
          Actualizar
        </Button>
        <Button className="Botondetails" danger onClick={handleDelete} style={{ marginRight: 10 }}>
          Eliminar
        </Button>
        <Button className="Botondetails" onClick={copyToClipboard} style={{ marginRight: 10 }}>Copiar enlace de seguimiento</Button>
        <Button className="Botondetails" onClick={() => navigate(-1)}>Regresar</Button>
      </div></>
  );
};

export default OrderDetails;
