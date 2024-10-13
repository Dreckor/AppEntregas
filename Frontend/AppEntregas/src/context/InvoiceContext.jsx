import { createContext, useState, useContext } from "react";
import { 
  getInvoices, 
  getInvoiceById, 
  createInvoice, 
  updateInvoiceStatus, 
  cancelInvoice 
} from '../api/invoices';

export const InvoiceContext = createContext();

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoiceProvider");
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await getInvoices();
      setInvoices(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  const createNewInvoice = async (invoice) => {
    setLoading(true);
    try {
      const res = await createInvoice(invoice);
      setInvoices([...invoices, res.data]);
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  const getInvoice = async (id) => {
    setLoading(true);
    try {
      const res = await getInvoiceById(id);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching the invoice");
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (id, status) => {
    setLoading(true);
    try {
      const res = await updateInvoiceStatus(id, status);
      setInvoices(invoices.map((invoice) => (invoice._id === id ? res.data : invoice)));
    } catch (err) {
      setError(err.response?.data?.message || "Error updating the invoice");
    } finally {
      setLoading(false);
    }
  };

  const cancellInvoice = async (id) => {
    setLoading(true);
    try {
      await cancelInvoice(id);
      setInvoices(invoices.filter((invoice) => invoice._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting the invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvoiceContext.Provider 
      value={{ 
        invoices, 
        loading, 
        error, 
        fetchInvoices, 
        createNewInvoice, 
        getInvoice, 
        updateInvoice, 
        cancellInvoice 
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
