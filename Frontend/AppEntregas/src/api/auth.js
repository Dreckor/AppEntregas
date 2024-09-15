import axios from "./axios"

export const loginRequets = (user) => axios.post('/login',user)

export const fetchUsersRequets = () => axios.get('/users') 

export const verifyTokenRequest = (user) => axios.post('/auth/verify',user)  