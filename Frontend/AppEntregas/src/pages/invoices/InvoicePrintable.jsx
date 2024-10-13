import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { InvoiceContext } from '../../context/InvoiceContext.jsx'; 
import Invoice from "../../components/templates/Invoice.jsx";

function InvoicePrintable() {
  const location = useLocation();
  const { invoiceId } = useParams(); 
  console.log(invoiceId)
  const { invoice: locationInvoice } = location.state || {};
  
  const [invoice, setInvoice] = useState(locationInvoice || null); // Estado local de la factura
  const { getInvoice, loading, error } = useContext(InvoiceContext); // Obtener el método y el estado del contexto

  // Efecto para buscar la factura si no está disponible
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoice) {
        const fetchedInvoice = await getInvoice(invoiceId); // Obtener la factura por ID
        setInvoice(fetchedInvoice);
      }
    };

    fetchInvoice();
  }, [invoiceId, invoice, getInvoice]);

  if (loading) return <div>Cargando la factura...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="invoice-container">
      {invoice ? (
        <Invoice invoice={invoice} />
      ) : (
        <div>No se pudo cargar la factura.</div>
      )}
    </div>
  );
}

export default InvoicePrintable;
