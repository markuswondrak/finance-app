import { describe, it, expect } from 'vitest';

/**
 * Color Coding Helper Functions
 *
 * These functions determine which color class to apply based on financial values.
 * They are designed to be used across components displaying financial data.
 */

/**
 * Returns the appropriate text color class for a financial value.
 * - Positive values: 'text-positive' (mint green #4ADE80)
 * - Negative values: 'text-negative' (soft coral #F87171)
 * - Zero values: 'text-neutral' (gray #9CA3AF)
 *
 * @param {number} value - The financial value to evaluate
 * @returns {string} The CSS class name to apply
 */
export function getValueColorClass(value) {
    if (value > 0) return 'text-positive';
    if (value < 0) return 'text-negative';
    return 'text-neutral';
}

/**
 * Returns the appropriate Vuetify color name for a financial value.
 * Used with Vuetify components that accept color props (e.g., v-chip, v-icon).
 *
 * @param {number} value - The financial value to evaluate
 * @returns {string} The Vuetify theme color name
 */
export function getValueVuetifyColor(value) {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
}

describe('Color Coding Logic', () => {
    describe('getValueColorClass', () => {
        it('should return text-positive for positive values', () => {
            expect(getValueColorClass(100)).toBe('text-positive');
            expect(getValueColorClass(0.01)).toBe('text-positive');
            expect(getValueColorClass(999999.99)).toBe('text-positive');
        });

        it('should return text-negative for negative values', () => {
            expect(getValueColorClass(-100)).toBe('text-negative');
            expect(getValueColorClass(-0.01)).toBe('text-negative');
            expect(getValueColorClass(-999999.99)).toBe('text-negative');
        });

        it('should return text-neutral for zero values', () => {
            expect(getValueColorClass(0)).toBe('text-neutral');
        });

        it('should handle edge cases correctly', () => {
            // Very small positive value
            expect(getValueColorClass(0.001)).toBe('text-positive');
            // Very small negative value
            expect(getValueColorClass(-0.001)).toBe('text-negative');
            // Exact zero
            expect(getValueColorClass(0.0)).toBe('text-neutral');
        });
    });

    describe('getValueVuetifyColor', () => {
        it('should return positive for positive values', () => {
            expect(getValueVuetifyColor(100)).toBe('positive');
            expect(getValueVuetifyColor(0.01)).toBe('positive');
        });

        it('should return negative for negative values', () => {
            expect(getValueVuetifyColor(-100)).toBe('negative');
            expect(getValueVuetifyColor(-0.01)).toBe('negative');
        });

        it('should return neutral for zero values', () => {
            expect(getValueVuetifyColor(0)).toBe('neutral');
        });
    });
});
