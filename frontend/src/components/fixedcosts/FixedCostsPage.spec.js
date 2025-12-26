import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FixedCostsPage from './FixedCostsPage.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

describe('FixedCostsPage.vue', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('filters costs by name', async () => {
    const mockData = {
        monthly: [
            { name: 'Rent', from: { year: 2023, month: 1 }, to: null },
            { name: 'Internet', from: { year: 2023, month: 1 }, to: null }
        ],
        quarterly: [], halfyearly: [], yearly: []
    };
    global.fetch.mockResolvedValue({
        json: () => Promise.resolve(mockData)
    });

    const wrapper = mount(FixedCostsPage, {
        global: { plugins: [vuetify] }
    });
    
    // Wait for created hook and fetch
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    // Search
    await wrapper.setData({ search: 'Rent' });
    
    const config = wrapper.vm.tabsConfig[0];
    expect(config.filteredEntries.length).toBe(1);
    expect(config.filteredEntries[0].name).toBe('Rent');
  });

  it('filters costs by date overlap', async () => {
    const mockData = {
        monthly: [
            { name: 'Old Cost', from: { year: 2020, month: 1 }, to: { year: 2021, month: 12 } },
            { name: 'Current Cost', from: { year: 2023, month: 1 }, to: null }
        ],
        quarterly: [], halfyearly: [], yearly: []
    };
    global.fetch.mockResolvedValue({
        json: () => Promise.resolve(mockData)
    });

    const wrapper = mount(FixedCostsPage, {
        global: { plugins: [vuetify] }
    });
    
    // Wait for load
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    // Select Date: Jan 2024
    await wrapper.setData({ date: new Date(2024, 0, 1) });
    
    const config = wrapper.vm.tabsConfig[0];
    expect(config.filteredEntries.length).toBe(1);
    expect(config.filteredEntries[0].name).toBe('Current Cost');

    // Select Date: June 2021
    await wrapper.setData({ date: new Date(2021, 5, 1) });
    const config2 = wrapper.vm.tabsConfig[0];
    expect(config2.filteredEntries.length).toBe(1); // Only Old Cost active
    expect(config2.filteredEntries[0].name).toBe('Old Cost');
  });
});