import api from './api';

const LocationService = {
  async getNearbyLocations(params) {
    try {
      const response = await api.get('/locations', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getLocationById(id) {
    try {
      const response = await api.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createLocation(locationData) {
    try {
      const response = await api.post('/locations', locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateLocation(id, locationData) {
    try {
      const response = await api.put(`/locations/${id}`, locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteLocation(id) {
    try {
      await api.delete(`/locations/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getUserLocations(userId) {
    try {
      const response = await api.get(`/locations/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default LocationService;