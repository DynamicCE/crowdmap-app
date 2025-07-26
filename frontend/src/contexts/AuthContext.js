import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AuthService.getToken();
      if (token) {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await AuthService.login(username, password);
      const userData = {
        username: response.username,
        authorities: response.authorities,
        id: response.userId || 1, // TODO: Backend'den user ID gelecek
      };
      setUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await AuthService.register(username, email, password);
      const userData = {
        username: response.username,
        email: email,
        authorities: response.authorities,
        id: response.userId || 1, // TODO: Backend'den user ID gelecek
      };
      setUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};