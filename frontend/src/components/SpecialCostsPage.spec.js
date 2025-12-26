import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SpecialCostsPage from './SpecialCostsPage.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { getSpecialCosts } from '../services/specialcosts';

vi.mock('../services/specialcosts', () => ({
    getSpecialCosts: vi.fn(),
    deleteSpecialCost: vi.fn()
}));

const vuetify = createVuetify({
  components,
  directives,
});

describe('SpecialCostsPage.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

  it('filters costs by name', async () => {
    getSpecialCosts.mockResolvedValue([
        { id: 1, name: 'Holiday', amount: -100, dueDate: { year: 2024, month: 1 } },
        { id: 2, name: 'Car Repair', amount: -500, dueDate: { year: 2024, month: 2 } }
    ]);

    const wrapper = mount(SpecialCostsPage, {
        global: { plugins: [vuetify] }
    });
    
    // Wait for load
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.entries.length).toBe(2);

    // Search
    await wrapper.setData({ search: 'Holiday' });
    
    expect(wrapper.vm.filteredEntries.length).toBe(1);
    expect(wrapper.vm.filteredEntries[0].name).toBe('Holiday');
  });

  it('filters costs by exact date', async () => {
    getSpecialCosts.mockResolvedValue([
        { id: 1, name: 'Holiday', dueDate: { year: 2024, month: 1 } },
        { id: 2, name: 'Car Repair', dueDate: { year: 2024, month: 2 } }
    ]);

    const wrapper = mount(SpecialCostsPage, {
        global: { plugins: [vuetify] }
    });
    
    // Wait for load
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    // Select Date: Feb 2024
    await wrapper.setData({ date: new Date(2024, 1, 1) });
    
    expect(wrapper.vm.filteredEntries.length).toBe(1);
    expect(wrapper.vm.filteredEntries[0].name).toBe('Car Repair');

    // Select Date: March 2024 (No match)
    await wrapper.setData({ date: new Date(2024, 2, 1) });
    expect(wrapper.vm.filteredEntries.length).toBe(0);
  });
});
