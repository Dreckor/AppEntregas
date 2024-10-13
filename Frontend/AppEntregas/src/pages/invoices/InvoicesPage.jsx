import { useEffect } from "react";
import { useInvoices } from "../../context/InvoiceContext.jsx";
import InvoicesList from "../../components/helpers/Invoices/InvoicesList.jsx";


function InvoicesPage() {
 
  const { fetchInvoices, invoices } = useInvoices();
  useEffect(() => {
    fetchInvoices()
    
  }, []);

  return (
    <div className="listadorde">
      <h1>Listado de facturas</h1>
      <InvoicesList invoices={invoices} />
    </div>
  );
}

export default InvoicesPage;
