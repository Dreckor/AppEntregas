import { createContext, useState, useContext } from "react";
import { 
  getDashboardRequest,
  getCsvRequest
} from '../api/dashboard';

export const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useConfig must be used within a DashboardProvider");
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener datos del dashboard
  const fetchDashboard = async (filters) => {
    console.log(filters)
    setLoading(true);
    try {
      const res = await getDashboardRequest(filters);
      setDashboard(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching config");
    } finally {
      setLoading(false);
    }
  };

  const exportOrders = async () => {
    try {
      setLoading(true);
      const res = await getCsvRequest();
      const blob = new Blob([res.data], { type: 'text/csv' });
  
      // Crear un enlace para descargar el archivo
  
      const filename = `orders.csv`;
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      setError(err.response?.data?.message || "Error exporting orders");
    } finally {
      setLoading(false);
    }
  };

 



  return (
    <DashboardContext.Provider 
      value={{ 
        dashboard, 
        loading, 
        error, 
        fetchDashboard, 
        exportOrders
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
