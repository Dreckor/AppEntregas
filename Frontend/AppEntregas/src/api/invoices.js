import axios from "./axios";

export const getInvoices = () => axios.get('/invoices');

export const getInvoiceById = (id) => axios.get(`/invoice/${id}`);

export const createInvoice = (invoice) => axios.post('/invoice', invoice);

export const updateInvoiceStatus = (id, status) => axios.put(`/invoice/${id}`, {"status": status});

export const cancelInvoice = (id) => axios.put(`/cancel/invoice/${id}`);