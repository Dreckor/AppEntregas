import axios from "./axios";

// Obtener la configuración global
export const getConfigRequest = () => axios.get('/config');

// Actualizar la configuración global
export const updateConfigRequest = (config) => axios.put('/config', config);

// Eliminar una opción de la configuración
export const deleteConfigOptionRequest = (optionData) => 
  axios.delete('/config', { data: optionData });
