import axios from "axios"

export const API = 'http://localhost:3001/api/v1'

const caxios = axios.create({
  baseURL: API,
})
export const addEndpoint = (data) => caxios.post('/endpoints', data)
export const getEndpoints = () => caxios.get('/endpoints')
export const destroyEndpoint = (id) => caxios.delete(`/endpoints/${id}`)
export const getLogs = (id) => caxios.get(`/endpoints/${id}/logs`);