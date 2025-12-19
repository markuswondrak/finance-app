import axios from 'axios';

const API_URL = 'http://localhost:8082/auth';

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
  
  login() {
    window.location.href = `${API_URL}/google/login`;
  }
};
