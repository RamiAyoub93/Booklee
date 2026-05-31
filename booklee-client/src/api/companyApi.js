import axiosClient from './axiosClient'

export const getCompanies = () => axiosClient.get('/companies')
export const getCompany = (id) => axiosClient.get(`/companies/${id}`)
export const getMyCompany = () => axiosClient.get('/companies/mine')
export const createCompany = (data) => axiosClient.post('/companies', data)
export const updateCompany = (id, data) => axiosClient.put(`/companies/${id}`, data)
