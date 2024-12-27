import {axiosInstance} from "../api/axios"


const propertyService = {
    getLocations: () => {
      return axiosInstance.get('/properties/locations');
    },
    getPropertyTypes: () => {
      return axiosInstance.get('/properties/propertyTypes');
    },
    addProperty: (property) => {
      return axiosInstance.post('/properties/addProperty', property);
    },
    getProperties: () => {
        return axiosInstance.get('/properties/fetchProperties');
    },
    updateProperty: (property) => {
        return axiosInstance.post(`/properties/updateProperty/${property._id}`, property);
    },
    deleteProperty: (propertyId) => {
        return axiosInstance.delete(`/properties/deleteProperty/${propertyId}`);
    },
    bookProperty: (bookingData) => {
      return axiosInstance.post('/properties/bookProperty', bookingData);
    },
    getGuestBookings: (userId) => {
      return axiosInstance.get(`/properties/fetchGuestBookings/${userId}`);
    },
    updateBookingStatus: (bookingId, action) => {
      return axiosInstance.post(`/properties/updateBookingStatus/${bookingId}`, { action });
    },
    getAdminStats: () => {
      return axiosInstance.get('/properties/getAdminStats');
    },
    getAllConfirmedBookings: () => {
      return axiosInstance.get('/properties/getBookingsByStatusForAdmin/confirmed');
    },
    transferEarnings: (payload) => {
      return axiosInstance.post(`/properties/transferEarnings/${payload.propertyId}/${payload.bookingId}`, payload);
    },
    getManagerStats: (propertyId) => {
      return axiosInstance.get(`/properties/getManagerStats/${propertyId}`);
    },
    extendBooking: (bookingData) => {
      return axiosInstance.post(`/properties/extendBooking/${bookingData.bookingId}`, bookingData);
    },
    cancelBooking: (bookingData) => {
      return axiosInstance.put(`/properties/cancelBooking/${bookingData.bookingId}`);
    }
}

export default propertyService;