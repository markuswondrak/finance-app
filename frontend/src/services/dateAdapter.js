/**
 * Date Adapter Utility for Month/Year Datepicker
 * Handles conversion between standard JavaScript Date objects and the application's
 * {year, month} data structure.
 */

/**
 * Converts a JS Date object to a {year, month} object.
 * @param {Date} date - The date to convert.
 * @returns {{year: number, month: number}|null} - The structured object or null if invalid.
 */
export const dateToYearMonth = (date) => {
  if (!date || isNaN(date.getTime())) {
    return null;
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1 // JS months are 0-indexed, app uses 1-12
  };
};

/**
 * Converts a {year, month} object to a JS Date object (set to 1st of month).
 * @param {{year: number, month: number}} yearMonth - The object to convert.
 * @returns {Date|null} - The Date object or null if invalid.
 */
export const yearMonthToDate = (yearMonth) => {
  if (!yearMonth || !yearMonth.year || !yearMonth.month) {
    return null;
  }
  // Month is 1-based in input, 0-based in JS Date
  return new Date(yearMonth.year, yearMonth.month - 1, 1);
};

/**
 * Formats a Date object to "Month Year" string (e.g., "January 2025").
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted string.
 */
export const formatDateLabel = (date) => {
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};
