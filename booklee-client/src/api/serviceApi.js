import axiosClient from './axiosClient'

export const getServices = (companyId) => axiosClient.get(`/companies/${companyId}/services`)
export const createService = (companyId, data) => axiosClient.post(`/companies/${companyId}/services`, data)
export const updateService = (companyId, serviceId, data) => axiosClient.put(`/companies/${companyId}/services/${serviceId}`, data)
export const deleteService = (companyId, serviceId) => axiosClient.delete(`/companies/${companyId}/services/${serviceId}`)
