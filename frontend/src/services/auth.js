import axios from 'axios';

const API_URL = '/auth';

export const AuthService = {
  async getUser() {
    try {
      // Credentials are sent via HTTP-only cookie
      const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async logout() {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
      window.location.href = '/';
    }
  },

  async deleteAccount() {
    try {
      await axios.delete('/api/user', { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error('Delete account failed', error);
      throw error;
    }
  },
  
  login() {
    const token = localStorage.getItem('pending_invite_token');
    let url = `${API_URL}/google/login`;
    if (token) {
      url += `?invite_token=${token}`;
    }
    window.location.href = url;
  }
};
