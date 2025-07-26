import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthService = {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, username: user, authorities } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify({ username: user, authorities }));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async register(username, email, password) {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token, username: user, authorities } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify({ username: user, authorities }));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async logout() {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  async getCurrentUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getToken() {
    return await AsyncStorage.getItem('authToken');
  },

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  },
};

export default AuthService;