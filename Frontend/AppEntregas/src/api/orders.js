import axios from "./axios"

export const createOrderRequest = async (order) => axios.post('/order',order) 

export const getOrdersRequest = () => axios.get('/orders');


export const getOrderRequest = (trackingNumber) => axios.get(`/order/${trackingNumber}`);


export const updateOrderRequest = (id, updatedOrderData) => axios.put(`/order/${id}`, updatedOrderData);


export const deleteOrderRequest = (id) => axios.delete(`/order/${id}`);