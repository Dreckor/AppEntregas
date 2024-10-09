import { createContext, useState, useContext } from "react";
import { 
  getConfigRequest, 
  updateConfigRequest, 
  deleteConfigOptionRequest 
} from '../api/settings';

export const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener la configuración
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await getConfigRequest();
      setConfig(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching config");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar la configuración
  const updateConfig = async (newConfig) => {
    setLoading(true);
    try {
      const res = await updateConfigRequest(newConfig);
      setConfig(res.data); // Actualiza la configuración con los nuevos datos
    } catch (err) {
      setError(err.response?.data?.message || "Error updating config");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una opción de la configuración
  const deleteConfigOption = async (optionData) => {
    setLoading(true);
    try {
        await deleteConfigOptionRequest(optionData);
        console.log(optionData)
        setConfig((prevConfig) => {
            // Identificar el tipo de opción que se está eliminando
            let updatedConfig = { ...prevConfig };
            console.log(updateConfig)

            if (optionData.type === 'productCategory') {
                updatedConfig.productCategories = updatedConfig.productCategories.filter(
                    (category) => category._id.toString() !== optionData._id.toString()
                );
            } else if (optionData.type === 'deliveryPoint') {
                updatedConfig.deliveryPoints = updatedConfig.deliveryPoints.filter(
                    (point) => point._id.toString() !== optionData._id.toString()
                );
            } else if (optionData.type === 'departurePoint') {
                console.log(optionData)
                updatedConfig.departurePoints = updatedConfig.departurePoints.filter(
                    (point) => point._id.toString() !== optionData._id.toString()
                );
            }

            return updatedConfig; // Retorna el objeto de configuración actualizado
        });
    } catch (err) {
        setError(err.response?.data?.message || "Error deleting config option");
    } finally {
        setLoading(false);
    }
};


  return (
    <ConfigContext.Provider 
      value={{ 
        config, 
        loading, 
        error, 
        fetchConfig, 
        updateConfig, 
        deleteConfigOption 
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
