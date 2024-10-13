import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Descriptions, Button, Select, notification } from 'antd';
import { InvoiceContext } from '../../context/InvoiceContext.jsx';
import { useInvoices } from '../../context/InvoiceContext';

const { Option } = Select;

const InvoiceDetails = () => {
  const { updateInvoice, cancellInvoice } = useInvoices();
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceId } = useParams(); // Obtener el ID de la URL
  const { invoice: locationInvoice } = location.state || {};
  const [invoice, setInvoice] = useState(locationInvoice || null); // Estado local de la factura
  const { getInvoice, loading, error } = useContext(InvoiceContext);
  const [state, setState] = useState(invoice?.status || 'pending'); // Estado de la factura

  // Obtener la factura si no está disponible localmente
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoice) {
        try {
          const fetchedInvoice = await getInvoice(invoiceId);
          setInvoice(fetchedInvoice);
          setState(fetchedInvoice.status); // Actualizar el estado con el valor de la factura
        } catch (err) {
          console.log('Error fetching invoice:', err);
        }
      }
    };

    fetchInvoice();
  }, [invoiceId, invoice, getInvoice]);

  // Manejo de actualización del estado de la factura
  const handleUpdate = async () => {
    try {
      await updateInvoice(invoice._id, state);
      notification.success({ message: 'Factura actualizada correctamente' });
      navigate('/invoices');
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error al actualizar la factura' });
    }
  };

  // Manejo de cancelación de la factura
  const handleDelete = async () => {
    try {
      await cancellInvoice(invoice._id);
      notification.success({ message: 'Factura cancelada correctamente' });
      navigate('/invoices');
    } catch (error) {
      notification.error({ message: 'Error al cancelar la factura' });
    }
  };

  if (loading) return <div>Cargando la factura...</div>;
  if (error) return <div>Error: {error}</div>;

  // Renderizado seguro cuando los datos de la factura están disponibles
  return (
    <>
      {invoice ? (
        <div className='detallesord'>
          <Descriptions title="Detalles de la factura" bordered>
            <Descriptions.Item label="Título">
              Factura #{invoice.invoiceNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Cliente">
              {invoice.customer?.username || 'N/A'} - {invoice.customer?.address || 'Sin dirección'}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Select value={state} onChange={(value) => setState(value)}>
                <Option value="unpaid">Sin pagar</Option>
                <Option value="pending">Pendiente</Option>
                <Option value="paid">Pagada</Option>
                <Option value="cancelled">Cancelada</Option>
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="Productos">
              {invoice.products?.length > 0 ? (
                <ul>
                  {invoice.products.map((product, index) => (
                    <li key={index}>
                      {product.productLabel || 'Sin etiqueta'} - Unidades: {product.productUnits || 0} - Peso: {product.kilos || 0} Kg - Coste: {product.cost || 0}
                    </li>
                  ))}
                </ul>
              ) : (
                'Sin productos'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha de emisión">
              {new Date(invoice.issueDate).toLocaleDateString()} {/* Formato amigable de fecha */}
            </Descriptions.Item>
            <Descriptions.Item label="Valor neto">
              {`$${invoice.netAmount?.toFixed(2)}`} {/* Chequeo de valor y formateo */}
            </Descriptions.Item>
            <Descriptions.Item label="Valor IVA">
              {`$${invoice.taxAmount?.toFixed(2)}`}
            </Descriptions.Item>
            <Descriptions.Item label="Coste embalaje">
              {`$${invoice.packaging?.toFixed(2)}`}
            </Descriptions.Item>
            <Descriptions.Item label="Valor total">
              {`$${invoice.totalAmount?.toFixed(2)}`}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div>No se pudo cargar la factura.</div>
      )}

      <div className='detailsbt'>
        <Button className="Botondetails" type="primary" onClick={handleUpdate} style={{ marginRight: 10 }}>
          Actualizar
        </Button>
        <Button className="Botondetails" danger onClick={handleDelete} style={{ marginRight: 10 }}>
          Cancelar factura
        </Button>
        <Button className="Botondetails" onClick={() => navigate(-1)}>Regresar</Button>
      </div>
    </>
  );
};

export default InvoiceDetails;
