import axiosClient from './axiosClient'

export const createBooking = (data) => axiosClient.post('/bookings', data)
export const getMyBookings = () => axiosClient.get('/bookings/my')
export const getCompanyBookings = (companyId) => axiosClient.get(`/bookings/company/${companyId}`)
export const cancelBooking = (id) => axiosClient.put(`/bookings/${id}/cancel`)
export const confirmBooking = (id) => axiosClient.put(`/bookings/${id}/confirm`)
