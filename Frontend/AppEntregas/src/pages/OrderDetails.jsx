import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Descriptions, Button, Select, notification, QRCode } from 'antd';
import { useOrders } from '../context/OrderContext';
import { useConfig } from "../context/ConfigContext";
import Seguimiento from '../components/helpers/Seguimiento';
import '../css/OrderDetail.css';
import { API_URL } from "../config";
import comerza from '../assets/comerza.png';


const { Option } = Select;

const OrderDetails = () => {
  const { updateOrder, deleteOrder } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const { config, fetchConfig } = useConfig();

  useEffect(() => {
    fetchConfig();
  }, []);

  const trakingNumber = order?.trakingNumber || 'N/A';
  const totalValorDeclarado = order?.products?.reduce(
    (total, product) => total + (product.valorDeclarado || 0),
    0
  );
  const QRurl = `${window.location.origin}/order/${trakingNumber}`;

  const printDetails = () => {
    window.print();
  };

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
      <div className='logoPrint'>
        <img className="ComerzaLogo" src={comerza} alt="ComerzaLogo" />
        <div className="Bienvenidos">
          <h1>COMERZA</h1>
        </div>
      </div>
      <div className='detallesord'>
        <Descriptions title="Detalles de la Orden" bordered className='print-section'>
        <Descriptions.Item label="Remitente" className='print2'>
            <b>Cliente:</b>  {order?.user?.username || "Anónimo"}, <b>Dirección:</b> {order?.user?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Punto Inicial">
            {order?.initialPoint?.name || "No disponible"} <br />
            {order?.initialPoint?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Correo" >
          {order?.user?.email || "No disponible" }
          </Descriptions.Item>
          <Descriptions.Item label="Destinatario">{order?.orderTitle}</Descriptions.Item>
          <Descriptions.Item label="Destino">
            {order?.destinyPoint?.name || "No disponible"} <br />
            {order?.destinyPoint?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Correo del repartidor">
          {order?.assignedTo?.email || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Dice contener">
            {order?.products?.length > 0 ? (
              <ul style={{paddingLeft:0}}>
                {order.products.map((product, index) => (
                  <li key={index}>
                    <strong>{product?.productLabel || "Sin etiqueta"}</strong>
                    <br />
                    - Unidades: {product?.productUnits || 0}
                    <br />
                    - Peso: {product?.kilos || 0} Kg
                    <br />
                    - Coste: {product?.cost || 0}
                  </li>
                ))}
              </ul>
            ) : (
              'Sin productos'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Valor asegurado">
            {order?.insurance?.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Valor declarado total">{totalValorDeclarado.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}</Descriptions.Item>
          <Descriptions.Item label="Estado">
            <Select
              value={order?.state?.name}  
              onChange={(value) => (order.state = value)} // Evitar uso de `useState`
            >
              {config?.states?.length > 0 ? (
                config.states.map((state) => (
                  <Option key={state._id} value={state._id}>
                    {state.name}
                  </Option>
                ))
              ) : (
                <Option disabled>No hay estados disponibles</Option>
              )}
            </Select>
<<<<<<< HEAD
          </Descriptions.Item>
          <Descriptions.Item label="Punto Inicial">
            {order?.initialPoint?.name || "No disponible"} <br />
            {order?.initialPoint?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Destino">
            {order?.destinyPoint?.name || "No disponible"} <br />
            {order?.destinyPoint?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Número de Seguimiento">{trakingNumber}</Descriptions.Item>
          <Descriptions.Item label="Productos">
            {order?.products?.length > 0 ? (
              <ul>
                {order.products.map((product, index) => (
                  <li key={index}>
                    <strong>{product?.productLabel || "Sin etiqueta"}</strong>
                    <br />
                    - Unidades: {product?.productUnits || 0}
                    <br />
                    - Peso: {product?.kilos || 0} Kg
                    <br />
                    - Coste: {product?.cost || 0}
                    <br />
                    - Tipo de cobro: {product?.tipoDeCobro || 0}
                  </li>
                ))}
              </ul>
            ) : (
              'Sin productos'
            )}
          </Descriptions.Item>
          
          <Descriptions.Item label="Repartidor">
            Repartidor: {order?.assignedTo?.username || "No asignado"}, Dirección: {order?.assignedTo?.address || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Metodo de pago">
          {order?.paymentMethod?.name || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Valor asegurado">
          {(order?.insurance ?? 0).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Valor declarado total">{totalValorDeclarado.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}</Descriptions.Item>
          <Descriptions.Item label="Otros impuestos">
          {(order?.otherTaxes ?? 0).toLocaleString("es-CO", {
=======
          </Descriptions.Item>                
          <Descriptions.Item label="Metodo de pago">
            {order?.paymentMethod?.name}
          </Descriptions.Item>
          
          <Descriptions.Item label="Otros impuestos">
          {order?.otherTaxes?.toLocaleString("es-CO", {
>>>>>>> dreckor
              style: "currency",
              currency: "COP",
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Aduanas">
<<<<<<< HEAD
          {(order?.customsDuty ?? 0).toLocaleString("es-CO", {
=======
          {order?.customsDuty?.toLocaleString("es-CO", {
>>>>>>> dreckor
              style: "currency",
              currency: "COP",
            })}
          </Descriptions.Item>
          
          <Descriptions.Item className='qr' label="Seguimiento" span={2} >
          <QRCode 
            errorLevel="H"
            value={QRurl}
            icon="https://i.imgur.com/gcWJhAo.png"
            
          />{trakingNumber}</Descriptions.Item>
          <Descriptions.Item label="Observaciones y firma de quien recibe" span={3} >
            <br/><br/><br/>
          </Descriptions.Item>
        </Descriptions>

        <Seguimiento history={order?.history || []} />
      </div>
      <div className='upload-section'>
        <h3>Foto evidencia</h3>
        {order?.evidencePhoto && (
          <img
            src={API_URL.replace('api', '') + order.evidencePhoto}
            alt="Evidence"
            style={{ width: '100px', marginTop: '10px' }}
          />
        )}
      </div>
      <div className='signature-section'>
        <h3>Firma del Cliente</h3>
        {order?.clientSignature && (
          <img
            src={API_URL.replace('api', '') + order.clientSignature}
            alt="Client Signature"
            style={{ width: '100px', marginTop: '10px' }}
          />
        )}
      </div>
      <div className='detailsbt'>
        <Button
          className="Botondetails"
          type="primary"
          onClick={handleUpdate}
          style={{ marginRight: 10 }}
        >
          Actualizar
        </Button>
        <Button
          className="Botondetails"
          danger
          onClick={handleDelete}
          style={{ marginRight: 10 }}
        >
          Eliminar
        </Button>
        <Button
          className="Botondetails"
          onClick={copyToClipboard}
          style={{ marginRight: 10 }}
        >
          Copiar enlace de seguimiento
        </Button>
        <Button className="Botondetails" onClick={() => navigate(-1)}>
          Regresar
        </Button>
        <Button
          className="Botondetails"
          type="primary"
          onClick={printDetails}
          style={{ marginRight: 10 }}
        >
          Imprimir Guía
        </Button>
      </div>
    </>
  );
};

export default OrderDetails;
