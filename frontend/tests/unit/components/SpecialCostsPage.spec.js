import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SpecialCosts from '@/components/SpecialCostsPage.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as specialCostsService from '@/services/specialcosts';

const vuetify = createVuetify({
  components,
  directives,
});

// Mock service
vi.mock('@/services/specialcosts', () => ({
  getSpecialCosts: vi.fn(() => Promise.resolve([])),
  deleteSpecialCost: vi.fn(() => Promise.resolve())
}));

describe('SpecialCosts.vue', () => {
  it('imports correctly', () => {
    expect(SpecialCosts).toBeTruthy();
  });

  it('filters future costs correctly', () => {
    const wrapper = mount(SpecialCosts, {
      global: {
        plugins: [vuetify],
      },
    });

    const today = new Date();
    const pastDate = { year: today.getFullYear() - 1, month: 1 };
    const futureDate = { year: today.getFullYear() + 1, month: 1 };
    
    // We need to access the method that does the filtering or check computed property if available
    // Assuming 'items' data property and a computed property 'filteredItems' or similar method
    // For now, let's mock the component's internal logic or wait for implementation details
    // Since we are TDD-ing, let's assume a method `isFuture(yearMonth)` exists or test the outcome on rendered list if we mock data
    
    // Let's test the helper method directly if exposed, or via wrapper.vm
    // Assuming `isFuture` method on component
    expect(wrapper.vm.isFuture(pastDate)).toBe(false);
    expect(wrapper.vm.isFuture(futureDate)).toBe(true);
    
    // Boundary case: Current month should be future (true)
    const currentMonth = { year: today.getFullYear(), month: today.getMonth() + 1 };
    expect(wrapper.vm.isFuture(currentMonth)).toBe(true);
  });

  it('formats amount and date correctly', () => {
    const wrapper = mount(SpecialCosts, {
      global: {
        plugins: [vuetify],
      },
    });

    // Formatting checks rely on formatCurrency and formatDate methods (or similar)
    // Testing specific formatting outcomes
    
    // Amount formatting
    // Note: Intl.NumberFormat might use a non-breaking space (U+00A0) which looks like a space but isn't
    expect(wrapper.vm.formatAmount(500)).toMatch(/\+ 500,00[\s\u00A0]€/);
    expect(wrapper.vm.formatAmount(-500)).toMatch(/- 500,00[\s\u00A0]€/);
    
    // Date formatting (Month Year)
    // Utils.displayMonth seems to output "Month / Year"
    expect(wrapper.vm.formatDate({ year: 2025, month: 10 })).toBe('Oktober / 2025');
  });
});
