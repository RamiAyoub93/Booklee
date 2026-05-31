import axiosClient from './axiosClient'

export const getAvailability = (companyId) => axiosClient.get(`/companies/${companyId}/availability`)
export const setAvailability = (companyId, data) => axiosClient.put(`/companies/${companyId}/availability`, data)
export const getSlots = (companyId, serviceId, date) =>
  axiosClient.get(`/companies/${companyId}/availability/slots`, { params: { serviceId, date } })
