import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Descriptions, Button, Select, notification } from 'antd';
import { useOrders } from '../../context/OrderContext';
import { useConfig } from "../../context/ConfigContext";
import Seguimiento from '../../components/helpers/Seguimiento';
import '../../css/OrderDetail.css';
import { API_URL } from "../../config";

const { Option } = Select;

const RepartidorOrderDetails = () => {
  const { updateOrder, deleteOrder } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  const [orderTitle, setOrderTitle] = useState(order?.orderTitle || '');
  const [state, setState] = useState(order?.state || {});
  const [initialPoint, setInitialPoint] = useState(order?.initialPoint || {});
  const [destinyPoint, setDestinyPoint] = useState(order?.destinyPoint || {});
  const { config, fetchConfig } = useConfig();
  const trakingNumber = order?.trakingNumber || 'N/A';
  const [evidencePhoto, setEvidencePhoto] = useState(order?.evidencePhoto);
  const [clientSignature, setClientSignature] = useState(order?.clientSignature);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

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
        evidencePhoto, // Include the photo path here
        clientSignature // Include the signature here
      };
      await updateOrder(order._id, updatedOrder);
      notification.success({ message: 'Orden actualizada correctamente' });
      navigate('/repartidor/orders');
    } catch (error) {
      notification.error({ message: 'Error al actualizar la orden' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder(order._id);
      notification.success({ message: 'Orden eliminada correctamente' });
      navigate('/repartidor/orders');
    } catch (error) {
      notification.error({ message: 'Error al eliminar la orden' });
    }
  };

  const handleEvidencePhotoChange = async (event) => {
    const file = event.target.files[0];
    setEvidencePhoto(file)
};

  const startDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    canvas.addEventListener('mousedown', () => {
      setIsDrawing(true);
    });

    
    canvas.addEventListener('mouseup', () => {
      setIsDrawing(false);
      ctx.beginPath();
    });

    canvas.addEventListener('mousemove', (e) => {
      if (isDrawing) {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      }
    });
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");

    // Convertir el data URL a un Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Crear un archivo a partir del Blob
    const file = new File([blob], 'signature.png', { type: 'image/png' });

    // Guardar el archivo en el estado
    setClientSignature(file); // Guardar el archivo de firma
};

  return (
    <>
      <div className='detallesord'>
        <Descriptions title="Detalles de la Orden" bordered>
          <Descriptions.Item label="Título">
            {orderTitle} 
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
            Cliente: {order?.user?.username || "Usuario eliminado"}, Dirección: {order?.user?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Repartidor">
            Repartidor: {order?.assignedTo?.username || "No asignado"}, Dirección: {order?.assignedTo?.address || "No disponible"}
          </Descriptions.Item>
        </Descriptions>

        <Seguimiento history={order?.history || []} />
      </div>

      <div className='upload-section'>
        <h3>Subir Foto evidencia</h3>
        <input type="file" accept="image/*" onChange={handleEvidencePhotoChange} />
        {evidencePhoto && <img src={API_URL.replace('api', '') +evidencePhoto} alt="Evidence" style={{ width: '100px', marginTop: '10px' }} />}
      </div>

      <div className='signature-section'>
        <h3>Firma del Cliente</h3>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          style={{ border: '1px solid black' }}
          onMouseDown={startDrawing}
        />
        <Button onClick={saveSignature} style={{ marginTop: '10px' }}>Guardar Firma</Button>
        {clientSignature && <img src={API_URL.replace('api', '') +clientSignature} alt="Client Signature" style={{ width: '100px', marginTop: '10px' }} />}
      </div>

      <div className='detailsbt'>
        <Button className="Botondetails" type="primary" onClick={handleUpdate} style={{ marginRight: 10 }}>
          Actualizar
        </Button>
      
        <Button className="Botondetails" onClick={copyToClipboard} style={{ marginRight: 10 }}>Copiar enlace de seguimiento</Button>
        <Button className="Botondetails" onClick={() => navigate(-1)}>Regresar</Button>
      </div>
    </>
  );
};

export default RepartidorOrderDetails;
