import api from './api';

const CategoryService = {
  async getAllCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteCategory(id) {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default CategoryService;