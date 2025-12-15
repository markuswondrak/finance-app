
/**
 * Service for user-related API operations.
 */
export const userService = {
  /**
   * Updates the user's current starting capital.
   * @param {number} amount - The new amount in integers (Euros).
   * @returns {Promise<object>} The updated user object from the API.
   * @throws {Error} If the network request fails or returns a non-200 status.
   */
  async updateCurrentAmount(amount) {
    const response = await fetch('/api/user/current-amount', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update amount: ${response.statusText}`);
    }

    return await response.json();
  },
};
