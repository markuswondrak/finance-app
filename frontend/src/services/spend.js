/**
 * Service for save-to-spend feature API operations.
 */
export const SpendService = {
  /**
   * Fetches the current save-to-spend state.
   * @returns {Promise<object>} The save-to-spend data.
   */
  async getSaveToSpend() {
    const response = await fetch('/api/save-to-spend');
    if (!response.ok) {
      throw new Error(`Failed to fetch save-to-spend: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Updates the checking account balance.
   * @param {number} amount - The new balance amount in cents.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async updateBalance(amount) {
    const response = await fetch('/api/save-to-spend/balance', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update balance: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Marks a fixed cost as paid.
   * @param {number} costId - The fixed cost ID.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async markFixedCostPaid(costId) {
    const response = await fetch(`/api/save-to-spend/fixed-costs/${costId}/paid`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to mark fixed cost as paid: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Marks a fixed cost as pending (not paid).
   * @param {number} costId - The fixed cost ID.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async markFixedCostPending(costId) {
    const response = await fetch(`/api/save-to-spend/fixed-costs/${costId}/pending`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to mark fixed cost as pending: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Includes a fixed cost in save-to-spend tracking.
   * @param {number} costId - The fixed cost ID.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async includeFixedCost(costId) {
    const response = await fetch(`/api/save-to-spend/fixed-costs/${costId}/include`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to include fixed cost: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Excludes a fixed cost from save-to-spend tracking.
   * @param {number} costId - The fixed cost ID.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async excludeFixedCost(costId) {
    const response = await fetch(`/api/save-to-spend/fixed-costs/${costId}/exclude`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to exclude fixed cost: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Creates a new one-time pending cost.
   * @param {string} name - The cost name.
   * @param {number} amount - The cost amount in cents.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async createOneTimeCost(name, amount) {
    const response = await fetch('/api/save-to-spend/one-time-costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, amount }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create one-time cost: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Marks a one-time cost as paid.
   * @param {number} costId - The one-time cost ID.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async markOneTimeCostPaid(costId) {
    const response = await fetch(`/api/save-to-spend/one-time-costs/${costId}/paid`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to mark one-time cost as paid: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Marks a one-time cost as pending (not paid).
   * @param {number} costId - The one-time cost ID.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async markOneTimeCostPending(costId) {
    const response = await fetch(`/api/save-to-spend/one-time-costs/${costId}/pending`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to mark one-time cost as pending: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Deletes a one-time cost.
   * @param {number} costId - The one-time cost ID.
   * @returns {Promise<object>} The updated save-to-spend state.
   */
  async deleteOneTimeCost(costId) {
    const response = await fetch(`/api/save-to-spend/one-time-costs/${costId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete one-time cost: ${response.statusText}`);
    }
    return await response.json();
  },
};
