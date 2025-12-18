// Frontend service for Special Costs API interactions

const API_URL = '/api/specialcosts';

/**
 * Fetches all special costs from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of special costs.
 */
export async function getSpecialCosts() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Error fetching special costs: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Saves a special cost (create or update).
 * @param {Object} cost The special cost object to save.
 * @returns {Promise<Object>} A promise that resolves to the saved special cost.
 */
export async function saveSpecialCost(cost) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cost),
  });
  if (!response.ok) {
    throw new Error(`Error saving special cost: ${response.statusText}`);
  }
  
  // Backend might return empty body
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

/**
 * Deletes a special cost by ID.
 * @param {number} id The ID of the special cost to delete.
 * @returns {Promise<void>} A promise that resolves when deletion is complete.
 */
export async function deleteSpecialCost(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error deleting special cost: ${response.statusText}`);
  }
}
