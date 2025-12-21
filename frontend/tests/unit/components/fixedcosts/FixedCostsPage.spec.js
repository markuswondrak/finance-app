import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import FixedCosts from '@/components/fixedcosts/FixedCostsPage.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Stub for FixedCostsTable to avoid deep component tree rendering issues
// Note: The component is registered as "FixedCostsTable" (with 's') in FixedCosts.vue
const FixedCostsTableStub = {
  name: 'FixedCostTable',
  template: '<div class="fixed-cost-table-stub"></div>',
  props: ['entries', 'cols', 'formComponent']
};

// Stub for VSkeletonLoader to avoid issues with missing types in test env
const VSkeletonLoaderStub = {
  name: 'VSkeletonLoader',
  template: '<div class="v-skeleton-loader-stub"><slot /></div>',
  props: ['type', 'loading', 'transition']
};

describe('FixedCosts.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockApiData = {
    monthly: [
      { id: 1, name: 'Rent', amount: 1000 }
    ],
    quarterly: [
      { id: 2, name: 'Insurance', amount: 300, dueMonth: 1 }
    ],
    halfyearly: [
      { id: 3, name: 'Car Tax', amount: 200, dueMonth: 1 }
    ],
    yearly: [
      { id: 4, name: 'Annual Fee', amount: 100, dueMonth: 1 }
    ],
    currentBalance: 500
  };

  it('should render container', () => {
    global.fetch.mockResolvedValue({
      json: vi.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = mount(FixedCosts, {
      global: {
        plugins: [vuetify],
        stubs: { FixedCostsTable: FixedCostsTableStub, VSkeletonLoader: VSkeletonLoaderStub }
      }
    });

    const container = wrapper.findComponent({ name: 'VContainer' });
    expect(container.exists()).toBe(true);
  });

  it('should initialize with default data', async () => {
    global.fetch.mockResolvedValue({
      json: vi.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = mount(FixedCosts, {
      global: {
        plugins: [vuetify],
        stubs: { FixedCostsTable: FixedCostsTableStub, VSkeletonLoader: VSkeletonLoaderStub }
      }
    });

    // Initial state before fetch completes
    expect(wrapper.vm.monthly).toEqual([]);
  });

  it('should fetch data on created', async () => {
    global.fetch.mockResolvedValue({
      json: vi.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = mount(FixedCosts, {
      global: {
        plugins: [vuetify],
        stubs: { FixedCostsTable: FixedCostsTableStub, VSkeletonLoader: VSkeletonLoaderStub }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(global.fetch).toHaveBeenCalledWith('/api/costs');
  });

  it('should set data from API response', async () => {
    global.fetch.mockResolvedValue({
      json: vi.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = mount(FixedCosts, {
      global: {
        plugins: [vuetify],
        stubs: { FixedCostsTable: FixedCostsTableStub, VSkeletonLoader: VSkeletonLoaderStub }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(wrapper.vm.monthly).toEqual(mockApiData.monthly);
    expect(wrapper.vm.quaterly).toEqual(mockApiData.quarterly);
  });

  it('should have four tabs for different cost frequencies', async () => {
    global.fetch.mockResolvedValue({
      json: vi.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = mount(FixedCosts, {
      global: {
        plugins: [vuetify],
        stubs: { FixedCostsTable: FixedCostsTableStub, VSkeletonLoader: VSkeletonLoaderStub }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    const tabs = wrapper.findAllComponents({ name: 'VTab' });
    expect(tabs).toHaveLength(4);
  });

  it('should have correct tab labels', async () => {
    global.fetch.mockResolvedValue({
      json: vi.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = mount(FixedCosts, {
      global: {
        plugins: [vuetify],
        stubs: { FixedCostsTable: FixedCostsTableStub, VSkeletonLoader: VSkeletonLoaderStub }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    const tabs = wrapper.findAllComponents({ name: 'VTab' });
    expect(tabs.at(0).text()).toBe('Monatliche Kosten');
  });

  it('should render FixedCostTable for each tab (window item)', async () => {
    global.fetch.mockResolvedValue({
      json: vi.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = mount(FixedCosts, {
      global: {
        plugins: [vuetify],
        stubs: { FixedCostsTable: FixedCostsTableStub, VSkeletonLoader: VSkeletonLoaderStub }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    // In Vuetify 3, VWindow only renders the active tab content
    // Verify there are 4 window items configured
    const windowItems = wrapper.findAllComponents({ name: 'VWindowItem' });
    expect(windowItems).toHaveLength(4);

    // And at least one FixedCostTable is rendered (the active one)
    const tables = wrapper.findAllComponents({ name: 'FixedCostTable' });
    expect(tables.length).toBeGreaterThanOrEqual(1);
  });

  it('should show skeleton loaders when loading', () => {
    // delay resolution
    global.fetch.mockReturnValue(new Promise(() => {}));

    const wrapper = mount(FixedCosts, {
      global: {
        plugins: [vuetify],
        stubs: { FixedCostsTable: FixedCostsTableStub, VSkeletonLoader: VSkeletonLoaderStub }
      }
    });

    const skeletonLoaders = wrapper.findAllComponents({ name: 'VSkeletonLoader' });
    expect(skeletonLoaders.length).toBeGreaterThan(0);
  });
});