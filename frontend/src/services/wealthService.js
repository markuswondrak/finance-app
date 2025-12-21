/**
 * Service for wealth profile-related API operations.
 */
export const wealthService = {
  /**
   * Fetches the user's wealth profile configuration.
   * @returns {Promise<object>} The wealth profile object from the API.
   * @throws {Error} If the network request fails.
   */
  async getProfile() {
    const response = await fetch('/api/wealth-profile');

    if (!response.ok) {
      throw new Error(`Failed to fetch wealth profile: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Updates the user's wealth profile configuration.
   * @param {object} profile - The wealth profile data to save.
   * @returns {Promise<object>} The updated wealth profile object.
   * @throws {Error} If the request fails.
   */
  async updateProfile(profile) {
    const response = await fetch('/api/wealth-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update wealth profile: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Fetches the user's wealth forecast.
   * @returns {Promise<object>} The forecast data (points, details).
   * @throws {Error} If the network request fails.
   */
  async getForecast() {
    const response = await fetch('/api/wealth/forecast');

    if (!response.ok) {
      throw new Error(`Failed to fetch wealth forecast: ${response.statusText}`);
    }

    return await response.json();
  },
};
