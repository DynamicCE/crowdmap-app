import api from './api';

const CommentService = {
  async getLocationComments(locationId) {
    try {
      const response = await api.get(`/locations/${locationId}/comments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async addComment(locationId, commentData) {
    try {
      const response = await api.post(`/locations/${locationId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateComment(commentId, commentData) {
    try {
      const response = await api.put(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteComment(commentId) {
    try {
      await api.delete(`/comments/${commentId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default CommentService;