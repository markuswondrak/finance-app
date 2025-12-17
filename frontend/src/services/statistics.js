/**
 * Service for statistics-related API operations.
 */
export const statisticsService = {
  /**
   * Retrieves the monthly surplus statistics including current values and history.
   * @returns {Promise<object>} The surplus statistics object.
   * @throws {Error} If the network request fails.
   */
  async getSurplusStatistics() {
    const response = await fetch('/api/statistics/surplus');

    if (!response.ok) {
      throw new Error(`Failed to fetch surplus statistics: ${response.statusText}`);
    }

    return await response.json();
  },
};
