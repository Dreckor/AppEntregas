import axios from "./axios"

export const getDashboardRequest = (filters) => axios.get('/dashboard',{ params: filters });
export const getCsvRequest = () => {
    return axios.get(`/export-csv`, {
      responseType: 'blob'
    });
  };
