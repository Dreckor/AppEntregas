import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Descriptions, Button, Input, Select, notification } from 'antd';
import { useOrders } from '../context/OrderContext';
import { useConfig } from "../context/ConfigContext";
import Seguimiento from '../components/helpers/Seguimiento';
import '../css/OrderDetail.css';
const { Option } = Select;

const OrderDetails = () => {
  const { updateOrder, deleteOrder } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {}; // Verificación de si 'order' está presente

  const [orderTitle, setOrderTitle] = useState(order?.orderTitle || '');
  const [state, setState] = useState(order?.state || {});
  const [initialPoint, setInitialPoint] = useState(order?.initialPoint || {});
  const [destinyPoint, setDestinyPoint] = useState(order?.destinyPoint || {});
  const { config, fetchConfig } = useConfig();
  const trakingNumber = order?.trakingNumber || 'N/A';

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

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
    <>
      <div className='detallesord'>
        <Descriptions title="Detalles de la Orden" bordered>
          <Descriptions.Item label="Título">
            <Input value={orderTitle} onChange={(e) => setOrderTitle(e.target.value)} />
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            <Select value={state?.name} onChange={(value) => setState(value)}>
              {config?.states?.length > 0 ? (
                config.states.map((state) => (
                  <Option key={state._id} value={state._id}>
                    {state.name}
                  </Option>
                ))
              ) : (
                <Option disabled>No hay estados disponibles, revise la configuración del panel</Option>
              )}
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="Punto Inicial">
            {initialPoint?.name || "No disponible"} <br />
            {initialPoint?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Destino">
            {destinyPoint?.name || "No disponible"} <br />
            {destinyPoint?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Número de Seguimiento">
            {trakingNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Productos">
            {order?.products?.length > 0 ? (
              <ul>
                {order.products.map((product, index) => (
                  <li key={index}>
                    {product.productLabel || "Sin etiqueta"} - Unidades: {product.productUnits || 0} - Peso: {product.kilos || 0} Kg - Coste: {product.cost || 0}
                  </li>
                ))}
              </ul>
            ) : (
              'Sin productos'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Cliente">
            Cliente: {order?.user?.username || "Anónimo"}, Dirección: {order?.user?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Repartidor">
            Repartidor: {order?.assignedTo?.username || "No asignado"}, Dirección: {order?.assignedTo?.address || "No disponible"}
          </Descriptions.Item>
        </Descriptions>

        <Seguimiento history={order?.history || []} />
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
      </div>
    </>
  );
};

export default OrderDetails;
