import axios from "./axios"

export const updateUserRequest = (id,user) => axios.put(`/users/${id}`,user)

export const deleteUserRequest = (id,user) => axios.delete(`/users/${id}`,user)

export const createUserRequest = (user) => axios.post(`/users/`,user)